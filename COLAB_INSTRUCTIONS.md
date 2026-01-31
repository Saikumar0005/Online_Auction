# ☁️ Running "Bid & Win" in Google Colab

This project is designed to be portable. You can run the entire stack (Backend + Frontend + DB) inside Google Colab for demonstration purposes.

### Steps

1.  **Open Google Colab**
2.  **Create a New Notebook**
3.  **Paste the following Code Blocks** in order.

### Block 1: Setup Environment & Install Dependencies
```python
!npm install -g npm@latest
!npm install -g create-vite
# Install MongoDB
!wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
!echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
!sudo apt-get update
!sudo apt-get install -y mongodb-org
!mkdir -p /data/db
!mongod --fork --logpath /var/log/mongodb.log --dbpath /data/db
```

### Block 2: Clone/Upload Code (Simulated)
*If you are in Colab, you would typically `git clone` this repo. For this demo, we assume files are present or you verify via localtunnel.*

### Block 3: Run Backend (Background Task)
```python
%%bash --bg 
cd bid-and-win-backend
npm install
npm start
```

### Block 4: Expose Backend via LocalTunnel
```python
!npm install -g localtunnel
get_ipython().system_raw('lt --port 5000 >> url.txt 2>&1 &')
import time
time.sleep(4)
!cat url.txt
```
*Copy the url generated above (e.g., `https://calm-monkey-44.loca.lt`).*

### Block 5: Update Frontend Config
*Manually update `frontend/src/services/api.js` `API_URL` to the `localtunnel` URL from Block 4.*

### Block 6: Run Frontend
```python
%%bash --bg
cd bid-and-win-frontend
npm install
npm run dev -- --host
```

### Block 7: Expose Frontend
```python
get_ipython().system_raw('lt --port 5173 >> frontend_url.txt 2>&1 &')
time.sleep(4)
!cat frontend_url.txt
```

### Access
Open the Frontend URL. It will talk to the Backend URL (tunnel) which talks to the local MongoDB in Colab.
