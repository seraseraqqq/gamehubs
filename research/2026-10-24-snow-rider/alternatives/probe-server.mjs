// Local, noindex iframe probe. Does not modify or deploy the production website.
import http from 'node:http';
const games={
 miniplay:{title:'Snow Rider 3D — Miniplay public embed',url:'https://www.miniplay.com/embed/snow-rider-3d'},
 neo:{title:'Snow Rider Neo — GameMonetize public embed',url:'https://html5.gamemonetize.games/e4woyszceuiqga5qts3de48wf7gczzsb/'},
 rush:{title:'Snow Rush 3D — GameMonetize public embed',url:'https://html5.gamemonetize.games/qz19c89oeh9xgil0vhin4coe5c6y8o9x/'}
};
const server=http.createServer((req,res)=>{
 const id=new URL(req.url,'http://localhost').pathname.slice(1),game=games[id];
 res.setHeader('X-Robots-Tag','noindex, nofollow');
 res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');
 res.setHeader('Content-Type','text/html; charset=utf-8');
 res.setHeader('Content-Security-Policy',"default-src 'self'; style-src 'unsafe-inline'; frame-src https://www.miniplay.com https://html5.gamemonetize.games https://html5.gamemonetize.co; object-src 'none'; base-uri 'none'");
 if(!game){res.end('<h1>Local embed probes</h1>'+Object.entries(games).map(([key,g])=>`<p><a href="/${key}">${g.title}</a></p>`).join(''));return;}
 res.end(`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><title>${game.title}</title><style>body{margin:0;background:#18221f;color:#fff;font:16px system-ui}header{height:54px;display:flex;align-items:center;padding:0 16px;gap:18px}a{color:#fff}h1{font-size:16px}iframe{width:100%;height:calc(100vh - 54px);border:0;display:block}</style><header><a href="/">Probes</a><h1>${game.title}</h1><span>Local test · not deployed</span></header><iframe src="${game.url}" title="${game.title}" allow="autoplay; fullscreen; gamepad" allowfullscreen></iframe></html>`);
});
server.listen(4215,'127.0.0.1',()=>console.log('Local iframe probes: http://127.0.0.1:4215/'));
