// File: MyComponent.js
import React from 'react';
import { useToast, toast } from "@/components/ui/use-toast";

function MyComponent() {
  const { toast: showToast } = useToast();
  
  return React.createElement('div', null,
    React.createElement('button', {
      onClick: () => showToast({ title: "Hello" })
    }, 'Show Toast')
  );
}