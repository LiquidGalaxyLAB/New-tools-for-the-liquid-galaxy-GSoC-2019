# New tools for the liquid galaxy GSoC 2019
Here you will find the split repos:
* [Liquid Galaxy KML API](https://github.com/LiquidGalaxyLAB/liquid-galaxy-kml-uploader)
* [Google Assistant API for liquid Galaxy]()

## Liquid Galaxy KML API

The system will interact over the liquid galaxy using a KML with a network link.

This KML will do requests to our API. And this one will control which data will be sent to the system.

Here we can see a project scheme:

![Project Definition](./liquid-galaxy-kml-uploader/docs/Definition.jpg)

You can build new KML and concatenate your own kmls to the current one.

But if you use the upload call, you will just be able to display this one

## Google Assistant API for Liquid-Galaxy 

### Requirements:
* [Ngrok](https://ngrok.com/) to connect the dialog flow to the webhook
* [KML API for liquid galaxy](https://github.com/LiquidGalaxyLAB/liquid-galaxy-kml-uploader), configured and working
