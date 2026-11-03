# Lenovo Hardware Check
[![Build and Minify](https://github.com/oxgro/oxgro.github.io/actions/workflows/build.yml/badge.svg)](https://github.com/oxgro/oxgro.github.io/actions/workflows/build.yml)
[![Deploy to Pages](https://github.com/oxgro/oxgro.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/oxgro/oxgro.github.io/actions/workflows/deploy.yml)

A simple tool to help ease the imaging process for new laptops. Provides tools
for testing the [keyboard](#keyboard), [speakers/microphone](#speakersmicrophone),
[camera](#camera), and for more easily installing the Lenovo Service Bridge and
updating [drivers](#drivers).

### Keyboard
Includes every key on standard Lenovo laptops, aside from the <kbd>Fn</kbd>,
<kbd>Win</kbd>, and <kbd>PrtScr</kbd> keys. <kbd>Fn</kbd> is handled by the
keyboard itself and cannot be directly tested (technically you can test for
its side effects, but I opt not to). The <kbd>Win</kbd> and <kbd>PrtScr</kbd>
keys are fully testable, but they unfocus the website and are generally a
pain. A key can be overriden as working by double clicking the associated
key on the visualization.

### Speakers/Microphone
The automatic test plays a tone on the left then right laptop speaker and
listens for it on both the laptop and headset microphones. The website will
not try to test your headphone speakers, as they are not loud enough to
reliably hear on the laptop's microphone. Instead, the user is encouraged
to test the headset speakers in each USB port by playing a short jingle in
each ear.

### Camera
Simply shows you your camera and gives an option to either confirm that it
looks good and proper, or to indicate that it does not look good. Make sure
to uncover the camera.

### Drivers
Offers a button to directly download the Lenovo Service Bridge, then another
button to go through Lenovo's download website. Saves time by allowing you
to immediately download the LSB without waiting for Lenovo's website to
realize that you don't have it.
