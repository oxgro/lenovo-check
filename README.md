# Lenovo Hardware Check
A simple tool to help ease the imaging process for new laptops.

## Keyboard
Includes every key on standard Lenovo laptops, aside from the <kbd>Fn</kbd>,
<kbd>Win</kbd>, and <kbd>PrtScr</kbd> keys. <kbd>Fn</kbd> is handled by the
keyboard itself and cannot be directly tested (technically you can test for
its side effects, but I opt not to). The <kbd>Win</kbd> and <kbd>PrtScr</kbd>
keys are fully testable, but they unfocus the website and are generally a
pain. A key can be overriden as working by double clicking the associated
key on the visualization.

## Speakers/Microphone
The automatic test plays a tone on the left then right laptop speaker and
listens for it on both the laptop and headset microphones. It also attempts
to test your headset speaker by playing in the left then right ear and
listening on the laptop microphone, but if that fails, the user is prompted
to manually test the headset by playing a short jingle.

> ℹ️ This will likely be changed in the future to not attempt automatic
> testing for the headset speakers, as they need to be tested multiple times,
> one for each port

## Camera
Simply shows you your camera and gives an option to either confirm that it
looks good and proper, or to indicate that it does not look good. Make sure
to uncover the camera.

## Drivers
Offers a button to directly download the Lenovo Service Bridge, then another
button to go through Lenovo's download website. Saves time by allowing you
to immediately download the LSB without waiting for Lenovo's website to
realize that you don't have it.
