    "start": "webpack serve --mode development",
    "build": "webpack --mode production",
    "prestart": "npm run install-script",
    "install-script": "powershell -ExecutionPolicy Bypass -File .\\install.ps1",
    "start:https": "webpack serve --mode development --open --https",
    "start:network": "webpack serve --mode development --open --host 0.0.0.0",
    "build:analyze": "webpack --mode production --profile --json > stats.json && webpack-bundle-analyzer stats.json",
    "dev": "concurrently \"npm run start\" \"webpack serve --mode development --open python ./backend/app.py\""
  }