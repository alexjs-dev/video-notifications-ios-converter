# Video Notification Converter

### Tool for Yoloholo Notifications service to obtain iOS compatible transparent .mov videos

`ffmpeg -y -i color.mp4 -i alpha.mp4 -f lavfi -i color=c=black:s=320x568 -filter_complex "[1:v]scale=320:568,setsar=1:1,split[vs][alpha];[0:v][vs]alphamerge[vt];[2:v][vt]overlay=shortest=1[rgb];[rgb][alpha]alphamerge" -shortest -c:v hevc_videotoolbox -allow_sw 1 -alpha_quality 0.75 -vtag hvc1 -pix_fmt yuva420p -an output.mov`

## Technologies:

- `electron`
- `ffmpeg`
- `react`

!NB Tool should only be used on MacOS (hevc_videotoolbox isn't supported on Windows and Linux)
