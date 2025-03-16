import React from 'react'
import {MessageSquare} from 'lucide-react'

export default function ChatSelectedFirst() {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50">
        <div className="max-w-md text-center space-y-6">
        {/* Ison to display */}
        <div className="flex justify-center gap-4 mb-4">
            <div className="relative">
                <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center animate-bounce">
                <MessageSquare className="size-10 text-primary" />
                </div>
            </div>
        </div>
        {/* Welcome text */}
        <h2 className="text-2xl font-semibold">Let's Begin your Fist Meet!</h2>
        <p className="text-base-content/60">
            Start a conversation with her with end-to-end encription by typing or sending some images/documents
        </p>
        </div>
    </div>
  )
}