USER=pobopo
IP='192.168.1.7'
npm run build
scp -r /home/pobopo/projects/smart_thing/smart_thing_web/dist/* $USER@$IP:/home/$USER/web/
ssh $USER@$IP "sudo cp -r /home/$USER/web/* /var/www/html/"
