# Moncking
This is a money tracking application



# FIRST TIME DEPLOYMENT

# Create a new Ubuntu Server on AWS EC2

1. Sign into the AWS Management Console at https://aws.amazon.com/console/. If you don't have an account yet click the "Create a Free Account" button and follow the prompts.
2. Go to the EC2 Service section.
3. Click the "Launch Instance" button.
4. Choose AMI - Check the "Free tier only" checkbox, enter "Ubuntu" in search box and press enter, then select the "Ubuntu Server 18.04" Amazon Machine Image (AMI).
5. Choose Instance Type - Select the "t2.micro" (Free tier eligible) instance type and click "Configure Security Group" in the top menu.
6. Configure Security Group - Add a new rule to allow HTTP traffic then click "Review and Launch".
7. Review - Click Launch
8. Select "Create a new key pair", enter a name for the key pair (e.g. "my-aws-key") and click "Download Key Pair" to download the private key, you will use this to connect to the server via SSH.
3. Under Type of key to generate, choose RSA
9. Click "Launch Instances", then scroll to the bottom of the page and click "View Instances" to see details of the new Ubuntu EC2 instance that is launching.


# Connect to Ubuntu EC2 Instance via SSH(For Windows by using PUTTY SSH client) 
1. Visit the url http://www.chiark.greenend.org.uk/~sgtatham/putty/ and download the according to you windows.
2. Install with the putty installer with default settings.
3. Convert your private key using PUTTYgen, from start menu choose PuttyGen.
4. Choose Load. By default, PuTTYgen displays only files with the extension .ppk. To locate your .pem file, choose the option to display files of all types and select the file downloaded at the time of creating AWS EC2.
5. To save the key in the format that PuTTY can use, choose Save private key. PuTTYgen displays a warning about saving the key without a passphrase. Choose Yes.
6. Specify the same name for the key that you used for the key pair (for example, my-key-pair) and choose Save. PuTTY automatically adds the .ppk file extension.
7. Open Putty Application and select Session tab from the left bar.
8. In the hostname box enter ubuntu@public_dns_domain name(from the EC2 instance copy the domain name).
9. In Saved sessions options add AWS and save it for future.
10. Now Under SSH tab from left select Auth and browse for the .ppk file generated in 6.
11. Now open the Session.


# Setup Web Server with Node.js + MongoDB + NGINX
1. Run the scripts from the setup_web_server_scipt.txt for node, mongodb, nginx etc.
2. For instructions on how to securely connect to the remote MongoDB server from your local machine using Mongo Shell or MongoDB Compass see https://jasonwatmore.com/post/2020/02/05/connect-to-remote-mongodb-on-aws-ec2-simply-and-securely-via-ssh-tunnel.

ssh -i D:\Study\projects\moncking\moncking-aws-key.pem -N -f -L 8000:localhost:27017 ubuntu@ec2-3-145-188-105.us-east-2.compute.amazonaws.com


# Deploy Node.js + MongoDB Back-end API

1. Clone the Node.js + MongoDB API project into the /opt/back-end directory with the command sudo git clone https://github.com/cornflourblue/node-mongo-registration-login-api /opt/back-end
2. Navigate into the back-end directory and install all required npm packages with the command cd /opt/back-end && sudo npm install
3. Start the API using the PM2 process manager with command sudo pm2 start server.js



# Deploy the Angular App (For Windows)
1. Clone the angular project with command git clone https://github.com/aakarshsak/moncking-client.git and install npm packages with command npm install.
2. Build the Angular app with the command npm run build.
3. Connect to the server via SSH (instructions above) and create a new folder for the front end app with the command sudo mkdir /opt/front-end
4 Change the owner of the folder to the ubuntu user and group with the command sudo chown ubuntu:ubuntu /opt/front-end. This is to allow us to transfer the front end files in the next step.
5. Transfer the compiled app to the server via SSH using the PuTTY Secure Copy client with the command:
pscp -i D:\Study\projects\moncking\monching-aws-key.ppk -r D:\Study\projects\moncking-client\dist\moncking-client\* ubuntu@ec2-3-145-188-105.us-east-2.compute.amazonaws.com:/opt/front-end


# Configure NGINX to serve the Node.js API and Angular front-end

1. Delete the default NGINX site config file with the command sudo rm /etc/nginx/sites-available/default
2. Launch the nano text editor to create an new default site config file with sudo nano /etc/nginx/sites-available/default
3. Paste in the following config:
server {
  charset utf-8;
  listen 80 default_server;
  server_name _;

  # angular app & front-end files
  location / {
    root /opt/front-end;
    try_files $uri /index.html;
  }

  # node api reverse proxy
  location /v1/api/ {
    proxy_pass http://localhost:4000/;
  }
}
4. Save the file by pressing ctrl + x and selecting Yes to save.
5. Restart NGINX with the command sudo systemctl restart nginx

# NGINX Config Reference
server { ... } defines a server block which contains the configuration for a virtual server within NGINX.

charset utf-8; uses the charset directive to configure the virtual server to send all content with UTF-8 encoding, and importantly prevents any unicode characters in your javascript from being converted before being sent to the browser which can cause errors (e.g. invalid regular expression errors).

listen 80 default_server; uses the listen directive to configure the virtual server to accept requests on port 80 and sets it as the default virtual server on this NGINX server.

server_name _; uses the server_name directive to set the server name to an underscore (_) to make this server block a catch-all block that matches any domain name that doesn't match another more specific server block. Since this example has only one server block it will match all domain names.

location / { ... } defines a location block which contains the configuration for requests that have a URI beginning with a forward slash (/), unless the request URI matches another more specific location block.

root /opt/front-end/dist; uses the root directive to set the root directory to the front end dist folder (/opt/front-end/dist) for requests matching this location block.

try_files $uri /index.html; uses the try_files directive to first check for the existence of a file matching the request URI ($uri) and returning it if there is one. If no file matches the request URI then it defaults to returning /index.html.

location /api/ { ... } defines a location block which contains the configuration for requests that have a URI beginning with /api/.

proxy_pass http://localhost:4000/; uses the proxy_pass directive to proxy requests beginning with /api/ through to the Node.js API running at http://localhost:4000/.







# REDEPLOYMENT OF LATEST CHANGES FOR FRONT END AND BACK END

# For Front end

1. In the angular project change build script to "build": "ng build && pscp -i D:\\Study\\projects\\moncking\\monching-aws-key.ppk -r D:\\Study\\projects\\moncking-client\\moncking-client\\dist\\moncking-client\\* ubuntu@ec2-3-145-188-105.us-east-2.compute.amazonaws.com:/opt/front-end"
2. Now run the command npm run build.


# For Back end.

1. Push changes to git.
2. Pull changes on the putty session by using command sudo git pull.
3. Stop pm2 instance by using sudo pm2 kill.
4. Start the instance by using sudo pm2 start app.js.
    sudo git pull && sudo pm2 kill && sudo pm2 start app.js

# Nginx script change.

1. sudo rm /etc/nginx/sites-available/default
2. sudo nano /etc/nginx/
3. save changes by ctrl + x -> y -> Enter
4. sudo systemctl restart nginx



