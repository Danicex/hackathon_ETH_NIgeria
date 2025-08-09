"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Send, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useMyContext } from "@/Context/AppContext"
import axios from "axios"

export default function ShareProject({ setShare }) {
  const [isSharing, setIsSharing] = useState(false)
  const { projectInfo } = useMyContext()

  const form = useForm({
    defaultValues: {
      address: "",
      hash: projectInfo.hash || "",
    },
  })

  const onSubmit = async (values) => {
    try {
      setIsSharing(true)

      const response = await axios.post("/api/share", values)

      // Handle success (optional)
      console.log("Project shared:", response.data)

      form.reset()
      setShare(false)
    } catch (error) {
      console.error("Failed to share project:", error)
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <p className="float-end cursor-pointer" onClick={() => setShare(false)}>
        <X />
      </p>
      <CardHeader>
        <CardTitle>Share Project</CardTitle>
        <CardDescription>
          Share a project with another user via their wallet address
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wallet address</FormLabel>
                  <FormControl>
                    <Input placeholder="user wallet address" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter the Wallet address of the recipient
                  </FormDescription>
                  <small className="text-purple-400">
                    Make sure the user uses i-contract before sharing a project
                  </small>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hash"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Hash</FormLabel>
                  <FormControl>
                    <Input readOnly {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full bg-purple-600"
              disabled={isSharing}
            >
              {isSharing ? (
                <>Sharing...</>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Share Project
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
