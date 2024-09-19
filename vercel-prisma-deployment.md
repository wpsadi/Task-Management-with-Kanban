# to deploy a projcet that uses prisma on on vercel or netlify

u must make a few of these chnges

in package.json

add this

"build": "next build",

if prisma in root directory
`"postinstall": "prisma generate",`

if prisma is inside src
`"postinstall": "cd src & prisma generate",`

