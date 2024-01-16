USER=pobopo
IP='192.168.2.81'
npm run build
scp -r /home/pobopo/projects/smart_thing/smart_thing_web/dist/* $USER@$IP:/home/$USER/web/
ssh $USER@$IP "sudo cp -r /home/$USER/web/* /var/www/html/"
