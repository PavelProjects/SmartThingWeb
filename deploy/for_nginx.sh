USER=pobopo
IP='192.168.1.7'
npm run build
scp -r ./dist/* $USER@$IP:/home/$USER/web/
ssh $USER@$IP "sudo cp -r /home/$USER/web/* /var/www/html/"
