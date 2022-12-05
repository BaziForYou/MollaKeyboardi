# Features
- Translate the full sentences from English and Persian patterns when you forget to use Alt + Shift
- Support groups and super groups using command
- Optimize and low usage [(around 40 ~ 60 mb ram usage)](https://cdn.discordapp.com/attachments/555420890444070912/1049401824601444412/image.png)

# Preview
##### Private Message
![image](https://cdn.discordapp.com/attachments/555420890444070912/1049402222854815804/image.png)
##### Group Test
![image](https://cdn.discordapp.com/attachments/555420890444070912/1049402347488546816/image.png)

# Requirements
- [Node JS](https://nodejs.org/)
- Telegram bot token
- Brain

## Installation	
### Run as normal
- edit .env.exmaple and save as .env
- enter command to run
```bash
node main.js
```
### Run on docker
##### Using docker-compose
- edit .env.exmaple and save as .env
- run compose using command
```bash
docker-compose up
```
##### Using manual build
- edit .env.exmaple and save as .env
- first build images using command
```bash
docker build -t ImageName .
```
- then run docker using command
```bash
docker run --restart unless-stopped ImageName
```

