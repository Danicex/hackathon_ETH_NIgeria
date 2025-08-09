from typing import Annotated, Optional, List
from datetime import datetime
from fastapi import Depends, FastAPI, HTTPException, Query, status
from sqlmodel import Field, Session, SQLModel, create_engine, select, Relationship, desc
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.responses import JSONResponse
import openai
from solcx import compile_standard
import json
import os

#handle auth with jwt session...
# ----------------- Models -----------------
class Project(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    content: Optional[str] = Field(default=None)
    description: Optional[str] = Field(default=None)
    project_hash: Optional[int] = Field(default=None, index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    user_id: int = Field(foreign_key="user.id")  # Add this field
    user_wallet: str = Field(index=True) 
    user: Optional["User"] = Relationship(back_populates="projects")

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    wallet: str = Field(index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    projects: List["Project"] = Relationship(back_populates="user")



# ----------------- Database -----------------
sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"
connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]

# ----------------- App Setup -----------------
app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost",
]

app.add_middleware(
    CORSMiddleware,
allow_origins=["*"],    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#--------install compiler


# Install compiler when starting up

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# ----------------- user api -----------------
class Userquery(BaseModel):
    name:  str
    wallet_address: str
    
@app.post("/user", response_model=User)
def create_user(param: Userquery, session: SessionDep):
    # Check if user exists using the correct field name
    existing_user = session.exec(
        select(User).where(User.wallet == param.wallet_address)
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"User with wallet address {param.wallet_address} already exists."
        )

    try:
        new_user = User(
            name=param.name,
            wallet=param.wallet_address  # Note: using 'wallet' not 'wallet_address'
        )
        session.add(new_user)
        session.commit()
        session.refresh(new_user)
        return new_user
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)  # More concise error message
        )
#get all  users api    
@app.get("/user_check")
def read_user(
    session: SessionDep,
    wallet_address: str = Query(..., description="User's wallet address")
):
    statement = select(User).where(User.wallet == wallet_address)
    user = session.exec(statement).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {"message": "user exists", "user": user}

#----------------project api ----------
@app.post("/projects", response_model=Project)
def create_project(project: Project, session: SessionDep) -> Project:
    # Check if the user exists
    user = session.get(User, project.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Create project
    session.add(project)
    session.commit()
    session.refresh(project)

    return {"project_hash": project.project_hash, "message": "creeated successfully"}

#----get projects
@app.get('/project', response_model=List[Project])
def read_project(
    session: SessionDep,
    wallet_address: str = Query(..., description="User's wallet address")
):
    try:
        projects = session.exec(
            select(Project)
            .where(Project.user_wallet == wallet_address)
            .order_by(desc(Project.created_at))
        ).all()
        
        if not projects:
            return JSONResponse(
                status_code=404,
                content={"message": "No projects found for this wallet"}
            )
            
        return projects
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching projects: {str(e)}"
        )
#---------update project   
class UpdateParam(BaseModel):
    content: str
    project_hash: str
    user_id:  int

@app.put("/project/update")
def update_project(
    params: UpdateParam,
    session: SessionDep
):
    # Find the project by user_id and hash
    project = session.exec(
        select(Project)
        .where(Project.user_id == params.user_id)
        .where(Project.project_hash == params.project_hash)
    ).first()

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Update project content
    project.content = params.content

    session.add(project)
    session.commit()

    return {"message": "Project updated successfully"}


@app.delete("/projects/{project_id}")
def delete_project(project_id: int, session: SessionDep):
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    session.delete(project)
    session.commit()
    return {"ok": True}

class CodeRequest(BaseModel):
    code: str
    
openai.api_key = os.getenv("OPENAI_API_KEY")

@app.post("/api/clean_code")
async def clean_code(request: CodeRequest):
    try:
        code = request.code.replace("$", "")  # Remove $ placeholders

        # Call OpenAI Chat Completion API
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a Solidity expert. Refine and clean the following Solidity "
                        "smart contract code for clarity and correctness."
                    ),
                },
                {"role": "user", "content": code},
            ],
            temperature=0,
        )

        refined_code = response.choices[0].message["content"]

        return {"refinedCode": refined_code}

    except Exception as e:
        print("Error cleaning code:", e)
        raise HTTPException(status_code=500, detail="Failed to clean code")

#compile sol code

class SolidityCodeRequest(BaseModel):
    code: str

@app.post("/compile_code")
async def compile_solidity(request: SolidityCodeRequest):
    try:
        source_code = request.code

        # Compile the Solidity code
        compiled_sol = compile_standard(
            {
                "language": "Solidity",
                "sources": {
                    "MyContract.sol": {
                        "content": source_code
                    }
                },
                "settings": {
                    "outputSelection": {
                        "*": {
                            "*": ["abi", "metadata", "evm.bytecode", "evm.sourceMap"]
                        }
                    }
                }
            },
            solc_version="0.8.20"
        )

        # Extract contract information
        contract_name = list(compiled_sol['contracts']['MyContract.sol'].keys())[0]
        contract_interface = compiled_sol['contracts']['MyContract.sol'][contract_name]

        abi = contract_interface['abi']
        bytecode = contract_interface['evm']['bytecode']['object']

        return {
            "abi": abi,
            "bytecode": bytecode,
            "contract_name": contract_name
        }

    except Exception as e:
        print("Compilation error:", str(e))
        raise HTTPException(status_code=400, detail=f"Compilation failed: {str(e)}")
    
    
