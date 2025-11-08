#!/bin/bash

# Install required npm packages
npm install date-fns qrcode.react lucide-react

# Initialize shadcn components
npx shadcn-ui@latest init

# Add shadcn components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add table
npx shadcn-ui@latest add input
npx shadcn-ui@latest add select
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add popover
npx shadcn-ui@latest add calendar
