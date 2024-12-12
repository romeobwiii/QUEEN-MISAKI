import { watchFile, unwatchFile } from 'fs'
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import fs from 'fs'

import dotenv from 'dotenv'
dotenv.config()

const defaultOwner = '923337468951';


// Check for the OWNERS environment variable; if not found, use the default
const ownervb = process.env.OWNERS || process.env.OWNER_NUMBER || 'your number';  // put your number here

const ownerlist = ownervb.split(';');

global.owner = [];
for (let i = 0; i < ownerlist.length; i++) {
    global.owner.push([ownerlist[i], true]);
}
//
global.botname = process.env.BOTNAME || 'SANA_MD-V1';
global.pairingNumber = process.env.BOT_NUMBER || 'your number';  // put your number here
global.SESSION_ID = process.env.SESSION_ID || 'session id';  /eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoidUVTcXRjeHpJdk5aRzdMT2xzdTlKdjVkem1XUzRYZWZYeXdTb2Q0bUdXdz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiUDdUZ25MWVUxa1QrZmZOSGFYSnRsT2dDWi9WbDFKeFl5MlQ0T2YxcFdqVT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJxR0hIR1hyUmRGaWp3djhXeXhOL3JZSlRZaXJya2dGOEozTmtZN09NUTNBPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiI5ek5OTWxLRkVUeHBQSC90MWowMFpOQkNYUlR0YUVCSjBEa0Z0NEJCOWpnPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjJMbUo3dUk5UjliZDVhVVA5ZnZQTVp4Y0lCd1RpL3BKalZFQmFNNVV6RmM9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlRyeWtuTW9CVHB1dit2YTBMWG9YM2kzdGloL0wwVlgwQkFudldXdmZnWEU9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiYUxGcStTWTd3bHNlT1d2SmMzZC9EMmRZWnFET3NpOUFwQ2lkRWJ2bU9WQT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiWFp6d3J6T1ZYbU50STdVemNpRnljNUpWck41TE91MXExTjcxV1pmV253dz0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkdXRWNtbCtVcTNJdHZ6QUFGSU9UV1p2SlNER213ZHZsZVRRdjFnbUZLUSs0eExhZE9tZGY5VVhHU3NIUDZIY0k3eWtBY3p1emYrSUxpRmJUYjNnVWl3PT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTksImFkdlNlY3JldEtleSI6IkR3dThFTy9QamhPWHNjSU1UY3pyQUN5K0xVQXlkVWprWGcrbjNWY0lMZ2M9IiwicHJvY2Vzc2VkSGlzdG9yeU1lc3NhZ2VzIjpbXSwibmV4dFByZUtleUlkIjozMSwiZmlyc3RVbnVwbG9hZGVkUHJlS2V5SWQiOjMxLCJhY2NvdW50U3luY0NvdW50ZXIiOjAsImFjY291bnRTZXR0aW5ncyI6eyJ1bmFyY2hpdmVDaGF0cyI6ZmFsc2V9LCJkZXZpY2VJZCI6IndqLVMtekZ4UUNhaXVmTnoxWm85c3ciLCJwaG9uZUlkIjoiNmRiNTMxZWItYzFmYi00YTk2LWJhMGQtMmE1NDk3NTU5Mzc3IiwiaWRlbnRpdHlJZCI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InViRVgxNlZLS3ByS21WaUlPZHIrR0MvTWxyUT0ifSwicmVnaXN0ZXJlZCI6dHJ1ZSwiYmFja3VwVG9rZW4iOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiI0NEV5VjZMeHVNRmx6MDBrTkxESCtkNC9LQWM9In0sInJlZ2lzdHJhdGlvbiI6e30sInBhaXJpbmdDb2RlIjoiRVFSUUNRMzciLCJtZSI6eyJpZCI6IjI2Nzc2NjYwOTAyOjE2QHMud2hhdHNhcHAubmV0IiwibmFtZSI6IvCdmoHwnZm+8J2ZvPCdmbTwnZm+IPCdmbHwnZqGIPCdmbjwnZm48J2ZuFsg8J2agfCdmbNdIn0sImFjY291bnQiOnsiZGV0YWlscyI6IkNOdjV3YVlERUoyNjY3b0dHQUVnQUNnQSIsImFjY291bnRTaWduYXR1cmVLZXkiOiJEb0JwMFF0QlRDeDVzN25VVGxnSlFnV3dkTjBpM21wcU1icTAyd2FndFRVPSIsImFjY291bnRTaWduYXR1cmUiOiJveTRhcG5oUzVlNlhldmc0dU1STURkM0NpREd4elErNEh4K2IwOWdpVVN4YjM2Y2diR1FWOHJiQzN3WWNuNzNtREd2MG1pSHVyUjdwNmFEQlEvdFlDUT09IiwiZGV2aWNlU2lnbmF0dXJlIjoiNDJ4cngwajBiR1dJZDhOckN1ZGM0aGtwbjZVdmduOGNOMEZDbytSa2JPaHBPd2UwLzk4MzFnTFFRa2VTb0JReUNzc0NuektlRHpaYWJtSVcrTXpsakE9PSJ9LCJzaWduYWxJZGVudGl0aWVzIjpbeyJpZGVudGlmaWVyIjp7Im5hbWUiOiIyNjc3NjY2MDkwMjoxNkBzLndoYXRzYXBwLm5ldCIsImRldmljZUlkIjowfSwiaWRlbnRpZmllcktleSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkJRNkFhZEVMUVV3c2ViTzUxRTVZQ1VJRnNIVGRJdDVxYWpHNnROc0dvTFUxIn19XSwicGxhdGZvcm0iOiJzbWJhIiwibGFzdEFjY291bnRTeW5jVGltZXN0YW1wIjoxNzM0MDA4MTA4fQ==/ put your session id here

global.mods = []
global.prems = []
global.allowed = ['917849917350', '923337468951']
global.keysZens = ['c2459db922', '37CC845916', '6fb0eff124']
global.keysxxx = keysZens[Math.floor(keysZens.length * Math.random())]
global.keysxteammm = [
  '29d4b59a4aa687ca',
  '5LTV57azwaid7dXfz5fzJu',
  'cb15ed422c71a2fb',
  '5bd33b276d41d6b4',
  'HIRO',
  'kurrxd09',
  'ebb6251cc00f9c63',
]
global.keysxteam = keysxteammm[Math.floor(keysxteammm.length * Math.random())]
global.keysneoxrrr = ['5VC9rvNx', 'cfALv5']
global.keysneoxr = keysneoxrrr[Math.floor(keysneoxrrr.length * Math.random())]
global.lolkeysapi = ['GataDios']

global.canal = 'https://whatsapp.com/channel/0029VagcqzY1XquemrHOM51n'


global.APIs = {
  // API Prefix
  // name: 'https://website'
  xteam: 'https://api.xteam.xyz',
  dzx: 'https://api.dhamzxploit.my.id',
  lol: 'https://api.lolhuman.xyz',
  violetics: 'https://violetics.pw',
  neoxr: 'https://api.neoxr.my.id',
  zenzapis: 'https://zenzapis.xyz',
  akuari: 'https://api.akuari.my.id',
  akuari2: 'https://apimu.my.id',
  nrtm: 'https://fg-nrtm.ddns.net',
  bg: 'http://bochil.ddns.net',
  fgmods: 'https://api.fgmods.xyz',
}
global.APIKeys = {
  // APIKey Here
  // 'https://website': 'apikey'
  'https://api.xteam.xyz': 'd90a9e986e18778b',
  'https://api.lolhuman.xyz': '85faf717d0545d14074659ad',
  'https://api.neoxr.my.id': `${keysneoxr}`,
  'https://violetics.pw': 'beta',
  'https://zenzapis.xyz': `${keysxxx}`,
  'https://api.fgmods.xyz': 'm2XBbNvz',
}

// Sticker WM
global.premium = 'true'
global.packname = 'Spider-Man_Md'
global.author = 'Sanatech'
global.menuvid = 'https://i.imgur.com/2Sp3cqD.mp4'
global.igfg = ' Follow on Instagram\nhttps://www.instagram.com/Tohidkhan6332'
global.dygp = 'https://whatsapp.com/channel/0029VagcqzY1XquemrHOM51n'
global.fgsc = 'https://Github.com/sana3165829/SANA_MD-V1'
global.fgyt = 'https://youtube.com/@Tohidkhan_6332'
global.fgpyp = 'https://GitHub.com/Tohidkhan6332'
global.fglog = 'https://i.imgur.com/nqCsIHZ.jpeg'
global.thumb = fs.readFileSync('./assets/tohid.jpg')

global.wait = '⏳'
global.rwait = '⏳'
global.dmoji = '🤭'
global.done = '✅'
global.error = '❌'
global.xmoji = '🤩'

global.multiplier = 69
global.maxwarn = '3'

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})
