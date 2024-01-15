USER=juan
IP='192.168.2.89'
npm run build
scp -r /home/pobopo/projects/smart_thing/smart_thing_web/dist/* $USER@$IP:/home/juan/web/
ssh $USER@$IP "sudo cp -r /home/$USER/web/* /var/www/html/"
