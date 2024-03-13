## Installation of source code on the respective servers
Steps for deploying source code to a server with maven script.

+ VPN to GW server: 

  GW vpn server

+ connect to the GW server (ex.: GW test server)

  Open your terminal and type the following

  ssh <user_name>@server
  ```
  ssh <user_name>@<server>
  ```
  you'll be prompted for your username and password, enter them.

+ (if you are a new user do this step else skip to next).

  Clone the git repository:
  ```
  git clone https://github.com/glygener/glygen-frontend.git
  ```

+ Move to folder "\glygen-frontend"
  ```
  cd glygen-frontend
  ```
+ (do this step if you are deploying this branch for the first time else skip to next).

  ```
  git pull
  ```
  Or use 
  ```
  git pull origin ver_??
  ```
  you'll be prompted for your GitHub username and password, enter them.

+ Change to the GitHub branch you wish to update on the server.
  git checkout <branch_name>
  ```
  git checkout ver_1.0
  ```

+ Check whether it's switched to the desired branch
  ```
  git branch
  ```

  The current working branch will be displayed with a "*" before it.
  ```shell
    7fece56
    master
    ver1-simplifyed-search
  * ver_1.0
  ```

+ update this repository, pull the latest GitHub changes
  ```
  git pull origin ver_??
  ```
  you'll be prompted for your GitHub username and password, enter them.

+ Deploying code by running script. For 'sudo' command please use server password.
    + For Dev server:
      ```
      make -f MakeFile dev
      ```
    + For Test server:
      ```
      sudo systemctl stop docker-glygen-frontend-test.service
      make -f MakeFile test
      sudo systemctl start docker-glygen-frontend-test.service
      ```
    + For Beta server:
      ```
      sudo systemctl stop docker-glygen-frontend-beta.service
      make -f MakeFile beta
      sudo systemctl start docker-glygen-frontend-beta.service
      ```
    + For Production server:
      ```
      sudo systemctl stop docker-glygen-frontend.service
      make -f MakeFile prod
      sudo systemctl start docker-glygen-frontend.service
      ```
      + For AWS server:
      ```
      sudo systemctl stop docker-glygen-frontend.service
      make -f MakeFile aws
      sudo systemctl start docker-glygen-frontend.service
      ```
  You'll receive a message, stating "Creating glygen-frontend-dev/glygen-frontend-test/glygen-frontend-beta/glygen-frontend ... done" and a list of deleted dangling images. If this is not the message, please contact your supervisor or Rene.

+ Exit the server
  ```
  exit
  ```

That's it, you are done.

## Installation phases
* **During Development phase:**
  Production and Beta have the code from the last version branch. Test has the code from the master.

* **During Test phase:**
  Production has the code from the last version branch. Test and Beta have the code from the master.

* **Release:**
  A new branch is created. Production and Beta get the code from the branch. Test remains master.
