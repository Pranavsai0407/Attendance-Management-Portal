
<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.



### Prerequisites

Make sure you have the following software installed on your local machine:
- [Node.js](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/)

  

### Installation


1. **Clone the repository**
    ```bash
    git clone https://github.com/Pranavsai0407/Attendance-Management-Portal.git
    cd Attendance-Management-Portal
    ```

2. **Install backend dependencies**
    ```bash
    cd ./backend
    npm install
    ```


3. **Set up environment variables**
    Create a `.env` file in the `backend` directory and add your configuration details:
    ```
   MONGODB_URL=your-mongodb-url
   SECRET_KEY="your-secret"
   AWS_ACCESS_KEY_ID=your access key
   AWS_SECRET_ACCESS_KEY=your secret accesss key
   PORT=5000
    ```
4. **Install frontend dependencies**
    ```bash
    cd ./frontend
    npm install
    ```

5. **Start the backend server**
    ```bash
    cd ..
    cd ./backend
    nodemon index.js
    ```

8. **Start the frontend server**
    ```bash
    cd ./frontend
    npm run dev
    ```


<p align="right">(<a href="#readme-top">back to top</a>)</p>
