"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useMyContext } from "@/Context/AppContext";
import { useNavigate } from "react-router-dom";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, History, X } from "lucide-react";
import ConnectWallet from "@/Landingpage/ConnectWallet";
import { saveContent } from "./SaveDoc"; // IndexedDB save helper

export default function CreatePage({ setOpenNew, setActiveProject }) {
  const { walletAdd, api_endpoint } = useMyContext();

  const [header, setHeader] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectList, setProjectList] = useState([]);
  const [hash, setHash] = useState("");

  const navigate = useNavigate();

  // Check wallet on mount
  useEffect(() => {
    if (!walletAdd) {
      setHeader(true);
    }
  }, [walletAdd]);

  // Fetch project list
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user_data"));
    const wallet_address = user.wallet_address;
    if (!user) return;

   
axios.get(`${api_endpoint}/project`, {
  params: {
    wallet_address: walletAdd  // Match the backend parameter name
  }
})
.then((res) => {
  setProjectList(res.data);
  console.log(res.data)
})
.catch((err) => {
  console.error("Error fetching projects:", err);
  // Optional: set error state for UI feedback
  setError("Failed to load projects");
});
  }, [api_endpoint]);

  // Generate unique hash
  const generateHash = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const randomValues = new Uint32Array(20);
    window.crypto.getRandomValues(randomValues);
    for (let i = 0; i < 20; i++) {
      result += characters.charAt(randomValues[i] % characters.length);
    }
    setHash(result);
    return result;
  };

  // Create project
  const handleCreateProject = async () => {
    if (!walletAdd) {
      setHeader(true);
      return;
    }

    const user = JSON.parse(localStorage.getItem("user_data") || "{}");
    if (!user?.id) {
      console.error("Invalid user data");
      return;
    }

    const projectHash = generateHash();
    const formData = {
      name: projectName,
      content: "",
      description: projectDescription,
      project_hash: projectHash,
      user_wallet: walletAdd,
      user_id: user.id,
    };

    try {
      const res = await axios.post(`${api_endpoint}/projects`, formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setOpenNew(false);
      const data = res.data;
      console.log("created")
      // Save in localstorage
      localStorage.setItem("current_project", data.project_hash);
      localStorage.setItem(
        "project_list",
        JSON.stringify({
          ...(projectList || {}),
          [data.project_hash]: {
            id: data.id,
            hash: data.project_hash,
            name: data.name,
          },
        })
      );

      // Save in IndexedDB
      await saveContent(data.project_hash, "");

      // Refresh project list
      setProjectList((prev) => [
        ...prev,
        { id: data.id, hash: data.project_hash, name: data.name },
      ]);

      setActiveProject(true);
      setSuccessMessage(true);
    } catch (error) {
      console.error(
        "Error creating project:",
        error?.response?.data || error.message
      );
    }
  };

  // Format date utility
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? "Invalid date"
      : date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
  };

  // Handle project click
  const handleSelectProject = (project) => {
    localStorage.setItem("current_project", project.project_hash);

    localStorage.setItem("project_info",   JSON.stringify({
    name: project.name,
    project_hash: project.project_hash,
    description: project.description,
    created_at: project.created_at
  }));
    setActiveProject(true);
    setOpenNew(false)
  };

  return (
    <div className="w-[60%] top-5 rounded-lg left-0 right-0 mx-auto py-5 px-4 absolute z-40 shadow-lg bg-[#131313] text-white">
      {/* Close Button */}
      <p className="float-end cursor-pointer" onClick={() => setOpenNew(false)}>
        <X />
      </p>

      {/* Wallet Connect Warning */}
      {header && (
        <div className="pb-5 md:flex items-start flex-col">
          <ConnectWallet />
          <p className="text-red-400 capitalize py-4">
            You need to connect a wallet!
          </p>
        </div>
      )}

      <h1 className="text-3xl font-bold mb-8">Project Management</h1>

      {/* Tabs */}
      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="create" className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" /> Create Project
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" /> History
          </TabsTrigger>
        </TabsList>

        {/* Create Project */}
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create a new project</CardTitle>
              <CardDescription>
                Fill in the details below to create your new project.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="project-name">Project Name *</Label>
                <Input
                  id="project-name"
                  placeholder="Enter project name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-description">Description</Label>
                <Textarea
                  id="project-description"
                  placeholder="Describe your project"
                  rows={4}
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleCreateProject}
                disabled={!projectName.trim()}
                className="w-full sm:w-auto bg-purple-500 hover:bg-purple-600"
              >
                Create Project
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Project History */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Project History</CardTitle>
              <CardDescription>
                View all your previously created projects.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {projectList.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No projects created yet. Create your first project in the
                  Create tab.
                </div>
              ) : (
                <div className="space-y-4">
                  {projectList.map((project, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 hover:bg-[#ffffff27] transition-colors cursor-pointer"
                      onClick={() => handleSelectProject(project)}
                    >
                      <p className="font-bold">{project.name}</p>
                      <p className="text-sm text-gray-400">{project.hash}</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(project.created_at)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Success Message */}
      {successMessage && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg">
          Project created successfully!
        </div>
      )}
    </div>
  );
}
