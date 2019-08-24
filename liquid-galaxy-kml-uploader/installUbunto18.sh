#!/bin/sh
. ${HOME}/etc/shell.conf

read -p "KML server IP: " serverIp
read -p "KML server Port: " serverPort

sudo tee -a /etc/environment << EOM
KMLSERVERIP="$serverIp"
KMLSERVERPORT="$serverPort"
EOM

#BUG FINDED! /document dosn't exist in some lgs

#ADD the kml viewsync into my places to auto load
sudo sed -i 's/<\/kml>//' ~/earth/kml/master/myplaces.kml
sudo sed -i 's/<\/Document>//' ~/earth/kml/master/myplaces.kml
sudo sed -i 's/<\/kml>//' ~/earth/kml/slave/myplaces.kml
sudo sed -i 's/<\/Document>//' ~/earth/kml/slave/myplaces.kml
sed -i "s/<ServerIP>/$serverIp/" documentation.json
sed -i "s/<ServerPort>/$serverPort/" documentation.json
cat >> ~/earth/kml/master/myplaces.kml << EOM
	<Folder>
    <name>KML API SYNC</name>
    <open>1</open>
		<NetworkLink>
			<flyToView>5</flyToView>
			<Link>
				<href>http://$serverIp:$serverPort/kml/viewsync/master
			</href>
			<refreshMode>onInterval</refreshMode>
			<refreshInterval>1</refreshInterval>
			</Link>
		</NetworkLink>
	</Folder>
</kml>
EOM

cat >> ~/earth/kml/slave/myplaces.kml << EOM
	<Folder>
    <name>KML API SYNC</name>
    <open>1</open>
		<NetworkLink>
			<flyToView>5</flyToView>
			<Link>
				<href>http://$serverIp:$serverPort/kml/viewsync/slave
			</href>
			<refreshMode>onInterval</refreshMode>
			<refreshInterval>1</refreshInterval>
			</Link>
		</NetworkLink>
	</Folder>
</kml>
EOM

#Build directory structure.
mkdir -p ~/kmlApi/images

for lg in $LG_FRAMES; do
	if [ $lg != lg1 ]
	then
		echo $lg
  	scp ~/earth/kml/slave/myplaces.kml lg@$lg:~/earth/kml/slave/myplaces.kml
	fi
done

exit 0
