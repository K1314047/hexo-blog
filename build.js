const Hexo = require('hexo');

async function main() {
  const hexo = new Hexo(process.cwd(), { silent: false });
  await hexo.init();
  await hexo.call('generate');
  await hexo.exit();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});