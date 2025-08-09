"use client"
import soliditySyntax from './Syntax'
import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Layout, Settings, PanelLeft, CircleX, Bot, Sparkles, Plus, CodeXml, FileX2 } from "lucide-react"
import Preview from "./Preview"
import { motion } from "framer-motion"
import ChatBot from './ChatBot'
import CreatePage from './CreatePage'
import axios from 'axios'
import Toolbar from './Toolbar'
import { saveContent, getContent, AutoSave } from './SaveDoc'
import { useMyContext } from '@/Context/AppContext'
import { useContractDeployment } from './DeployContract'

export default function HomePage() {
  const [openNew, setOpenNew] = useState(false)
  const { api_endpoint } = useMyContext();
  const [constructorVal, setConstructorVal] = useState('');
  const [success, setSuccess] = useState(false);
  const [activeProject, setActiveProject] = useState(false)
  const [activeTab, setActiveTab] = useState("components")
  const [openPreview, setOpenPreview] = useState(false);
  const [openAi, setOpenAi] = useState(false);
  const [code, setCode] = useState(`
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SimpleStorage {
    uint storedData;

    function set(uint x) public {
        storedData = x;
    }

    function get() public view returns (uint) {
        return storedData;
    }
}
  `);
  const [targetItems, setTargetItems] = useState([])
  const [params, setParams] = useState({});
  const [draggingItem, setDraggingItem] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [deployedAddress, setDeployedAddress] = useState('')
  const [error, setError] = useState('')
  const containerRef = useRef(null);
  const user = JSON.parse(localStorage.getItem('user_data') || '{}');
  const user_id = user?.id;
  const current_project = localStorage.getItem('current_project');
  const projectData = localStorage.getItem('project_info');


  // Load project content from IndexedDB
  useEffect(() => {
    const loadProject = async () => {
      if (current_project) {
        setActiveProject(true);
        const data = await getContent(current_project);
        if (data) {
          setCode(data.text);
        }
      }
    };
    loadProject();
  }, [current_project]);

  // Auto-save functionality
  useEffect(() => {
    if (!current_project) return;

    const autoSave = async () => {
      await saveContent(current_project, code);
      // await syncFile();
    };

    const interval = setInterval(autoSave, 30000); // Auto-save every 30 seconds
    return () => clearInterval(interval);
  }, [code, current_project]);

  // Keyboard shortcut for saving
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (current_project) {
          saveContent(current_project, code);
          syncFile();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code, current_project]);

  // Sync code with cloud
  const syncFile = async () => {
    if (!current_project || !user_id) return;


    try {
      const formData = {
        project_hash: current_project,
        content: code,
        user_id: user_id,
      }
      console.log(formData);

      const response = await axios.put(`${api_endpoint}/project/update`, formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('File synced successfully:', response.data);
    } catch (error) {
      console.error('Error syncing file:', error);
    }
  };

  // Drag and drop functions (unchanged as requested)
  const colorPool = [
    '#FF6B6B', '#6BCB77', '#4D96FF', '#FFC300', '#A66DD4',
    '#FF924C', '#00B8A9', '#F4A261', '#2A9D8F', '#E76F51'
  ];
  const randomColor = colorPool[Math.floor(Math.random() * colorPool.length)];

  const sourceItems = soliditySyntax.map((item, index) => ({
    ...item,
    id: item.id,
    color: randomColor
  }));
  //-----------drag action
  const onDragStart = (item) => {
    setDraggingItem(item);
  };

  const handleMove = (syntaxId, y_value) => {
    setTargetItems((prev) =>
      prev.map(item =>
        item.syntax_id === syntaxId
          ? { ...item, position: y_value }
          : item
      )
    );
  };

  
  const onDragEnd = (id, y_value) => {
    if (!draggingItem) return;

    if (sourceItems.find((item) => item.id === draggingItem.id)) {
      const clonedItem = {
        ...draggingItem,
        id: id,
        syntax_id: `${Date.now()}-syntax-${draggingItem.id}`,
        color: draggingItem.color,
        position: y_value
      };
      setTargetItems([...targetItems, clonedItem]);
    } else if (targetItems.find((item) => item.id === draggingItem.id)) {
      setTargetItems(targetItems.filter((item) => item.id !== draggingItem.id));
    }
    setDraggingItem(null);
  };

  const updateCode = (syntaxId) => {
    setTargetItems(prev =>
      prev.map(item => {
        if (item.syntax_id !== syntaxId) return item;
        const itemParams = params[syntaxId] || [];
        let paramIndex = 0;
        const updatedSyntax = (item.original_syntax || "").replace(/\$[^$]+\$/g, () => {
          return itemParams[paramIndex++] || "";
        });
        return { ...item, syntax: updatedSyntax };
      })
    );
  };

 const handleParamChange = (syntaxId, paramName, newValue) => {
  // Update the parameter value in your state
  setTargetItems(prev => prev.map(item => {
    if (item.syntax_id === syntaxId) {
      return {
        ...item,
        syntax: item.syntax.replace(`$${paramName}$`, `$${newValue}$`)
      };
    }
    return item;
  }));
  console.log(targetItems)
};

  const removeCodeBlock = (id) => {
    const x = targetItems.find(item => item.syntax_id === id);
    if (!x) return;
    let text_content = JSON.stringify(x);
    let words = text_content.split(' ');
    let startWord = words[0];
    let lastWord = words[words.length - 1];
    let regex = new RegExp(`\\b${startWord}.*${lastWord}\\b`, "g");
    setCode(prevCode => prevCode.replace(regex, '').trim());
    setTargetItems(targetItems.filter(item => item.syntax_id !== id));
  };

  const { deployContract } = useContractDeployment()

  const handleDeploy = async () => {
    setIsLoading(true)
    setError('')
    try {
      const { contractAddress, result } = await deployContract(code)
      setDeployedAddress(contractAddress)
      console.log("Deployment successful:", result);
    } catch (err) {
      setError(err.message)
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const global_height = 90;
  const heightInPixels = (global_height / 100) * window.innerHeight;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-black text-white">
      {/* Header */}
      <div>

        {deployedAddress && (
          <div>
            <h3>Contract deployed successfully!</h3>
            <p>Address: {deployedAddress}</p>
          </div>
        )}

        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      </div>


      <header className="flex justify-between items-center p-4 border border-gray-700">
        <div className="text-lg font-medium flex gap-2 items-center">
          <Bot className="w-8 h-8 text-purple-500" />
          <span className="text-white font-medium text-xl">i-contract</span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setOpenNew(!openNew)}>
            <Plus /> new project
          </Button>
          <Button variant="outline" size="sm" onClick={() => { setOpenPreview(!openPreview); setOpenAi(false) }}>
            <CodeXml /> Preview code
          </Button>
          <Button
            onClick={handleDeploy}
            disabled={isLoading}
            className='bg-purple-600'
          >
            {isLoading ? 'Deploying...' : 'Deploy Contract'}
          </Button>
        </div>
      </header>
      <Toolbar

      />
      {success && (
        <div>
          <p>congratulations your contract has been deployed</p>
          <p>here is  the adress {deployedAddress}</p>
        </div>
      )}
      {/* Main content */}
      <div className="flex h-screen  overflow-y-scroll relative">
        {openNew && (
          <CreatePage setOpenNew={setOpenNew} setActiveProject={setActiveProject} />
        )}


        {/* Tab list */}
        <div className="border-r border-l border-b border-gray-700 p-2 ">
          <div className='flex items-center gap-2 bg-purple-600 p-2 rounded-md'>
            <CodeXml size={16} />
            <p>Code</p>
          </div>


          <div value="components" className="mt-4">
            <div className="text-sm text-gray-400 mb-2">Drag elements to canvas</div>
            <div className="flex flex-col gap-2 max-h-[68dvh] border-2 border-dashed border-gray-700 p-4 rounded-lg overflow-y-scroll">
              {sourceItems.map((item) => (
                <div key={item.id}>
                  {item.category ? (
                    <p className="text-xs font-semibold text-gray-400 mt-4 first:mt-0">
                      {item.category}
                    </p>
                  ) : (
                    <motion.div
                      layoutId={item.id}
                      drag
                      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                      onDragStart={() => onDragStart(item)}
                      onDragEnd={(event, info) => onDragEnd(item.id, info.point.y)}
                      whileDrag={{ scale: 1.05, zIndex: 4, position: 'absolute' }}
                      style={{ zIndex: 2 }}
                      className={`bg-gray-700 p-2 rounded-md shadow cursor-grab active:cursor-grabbing text-white text-sm`}
                    >
                      {item.name}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Drop Zone */}
        <div className="flex-1 flex p-4">
          {activeProject ? (
            <div className="bg-gray-900 p-4 rounded-lg shadow-md w-full h-full overflow-y-scroll">
              <h2 className="text-lg font-semibold mb-4">Drop Zone</h2>
              <div
                className={`relative text-white border-2 border-dashed border-gray-700 p-4 rounded-lg min-h-[90dvh]`}
                ref={containerRef}
              >
                {targetItems.map((item) => {
                  const position = targetItems.find(pos => pos.id === item.id);
                  const y = position ? position.y : 0;

                  return (
                    <motion.div
                      key={item.syntax_id}
                      layoutId={item.syntax_id}
                      drag
                      onDragEnd={(event, info) => handleMove(item.syntax_id, info.point.y)}
                      dragConstraints={{ top: 0, bottom: heightInPixels - 118, left: 10, right: heightInPixels }}
                      whileDrag={{ scale: 1.05, zIndex: 2, position: 'absolute' }}
                      className="absolute w-[300px] text-white rounded-md shadow cursor-grab active:cursor-grabbing text-sm"
                      style={{ top: y, left: 0 }}
                    >
                      <div
                        className='bg-gray-800 p-5 rounded-lg'
                        key={item.id}
                        style={{ border: `2px solid ${item.color}` }}
                      >
                        <div>
                          <div style={{ backgroundColor: item.color }} className="w-2 p-2 rounded-full float-end flex"></div>
                          <CircleX onClick={() => removeCodeBlock(item.syntax_id)} className='absolute top-0 left-0 text-gray-300 active:text-white' />
                          <div className=" p-3 rounded text-xs mb-3 font-mono">
                            {item.syntax.split(/(\$[^$]+\$)/).map((part, i) => {
                              if (part.startsWith('$') && part.endsWith('$')) {
                                const paramName = part.slice(1, -1);
                                return (
                                  <input
                                    key={`${item.syntax_id}-param-${i}`}
                                    type="text"
                                    defaultValue={paramName}
                                    onChange={(e) => handleParamChange(item.syntax_id, paramName, e.target.value)}
                                    className="bg-gray-900 text-white border border-gray-600 rounded px-1 mx-1 w-20 inline-block"
                                  />
                                );
                              }
                              return part;
                            })}
                          </div>


                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className='text-gray-600 flex flex-col items-center w-full gap-4'>
              <p className='capitalize text-2xl'>no project opened!!</p>
              <FileX2 size={100} />
            </div>
          )}
          {openPreview && <Preview code={code} />}
        </div>
      </div>
    </div>
  );
}