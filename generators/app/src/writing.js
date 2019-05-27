const { spawn } = require('child_process');
const extend = require('deep-extend');
const mkdirp = require('mkdirp-promise')
const fs = require('fs-extra')


module.exports= async function(context){
    await buildMkdir(context);
    copyTemplates(context);
}
const buildMkdir= async (context)=>{
    let rootPath = context.destinationPath()+'/'+context.name;
    context.log('buildMkdir',context.destinationPath());
    await mkdirp(rootPath)
    context.destinationRoot(rootPath)
    context.rootPath = rootPath
    context.log('buildMkdir',context.destinationPath())
}
const copyTemplates=(context)=>{
    let params={
        name:context.name,
        description:context.description,
        version:context.version,
        isPC: context.isPC,
        isHistory:context.isHistory,
        includeElementUI:context.includeElementUI,
        isMobile:context.isMobile,
        isAdmin:context.isAdmin,
        includePrerender:context.includePrerender,
        isCDN:context.isCDN
    }
    context.log('copyTemplates',context.destinationPath())
    copyDotFiles(context);
    context.fs.copy(
        context.templatePath(),
        context.destinationPath(),
        {
            globOptions: {
                dot: true,
                ignore: ['**/@selections/**'],
                gitignore: false
            }
        }
      );
    context.fs.copyTpl(
        context.templatePath('@selections/package.ejs'),
        context.destinationPath('./package.json'),
        params
    );
    context.fs.copyTpl(
        context.templatePath('@selections/vue.config.ejs'),
        context.destinationPath('./vue.config.js'),
        params
    );
    context.fs.copyTpl(
        context.templatePath('@selections/postcss.config.ejs'),
        context.destinationPath('./postcss.config.js'),
        params
    );
    context.fs.copyTpl(
        context.templatePath('@selections/main.ejs'),
        context.destinationPath('./src/main.js'),
        params
    );
    context.fs.copyTpl(
        context.templatePath('@selections/permission.ejs'),
        context.destinationPath('./src/permission.js'),
        params
    );
    context.fs.copyTpl(
        context.templatePath('@selections/api/index.ejs'),
        context.destinationPath('./src/api/index.js'),
        params
    );
    context.fs.copyTpl(
        context.templatePath('@selections/lang/index.ejs'),
        context.destinationPath('./src/lang/index.js'),
        params
    );
    context.includeElementUI&&context.fs.copyTpl(
        context.templatePath('./@selections/plugins/element.js'),
        context.destinationPath('./src/plugins/element.js'),
        params
        );
    context.fs.copy(
        context.isAdmin?
            context.templatePath('./@selections/components/admin'):
            context.templatePath('./@selections/components/common'),
        context.destinationPath('./src/components')
    );
    context.fs.copy(
        context.isAdmin?
            context.templatePath('./@selections/pages/admin'):
            context.templatePath('./@selections/pages/common'),
        context.destinationPath('./src/pages')
    );
    
    context.fs.copyTpl(
        context.templatePath('@selections/router/index.ejs'),
        context.destinationPath('./src/router/index.js'),
        params
    );
    initGit();
}
const initGit=()=>{
    if (!fs.existsSync('.git')) {
        shspawn('git init')
    } 
}
const copyDotFiles=(context)=>{
    const dotFilesName=['.eslintrc.js','.gitignore','.browserslistrc'];
    spawn('cp', ['-r', context.templatePath('./.vscode'),context.destinationPath()]);
    dotFilesName.map((fileName=>{
        spawn('cp', ['-f', context.templatePath(`./${fileName}`),context.destinationPath()]);
    }))
}
const extendPkgJson=(context)=>{

    const pkg = context.fs.readJSON(context.templatePath('package.json'), {});
    console.log('extendPkgJson',pkg);
    extend(pkg,{
        name:context.name,
        description:context.description,
        version:context.version,
    })
    context.fs.writeJSON(context.destinationPath('package.json'), pkg);
}
const shspawn=(command)=> {
    spawn('sh', ['-c', command], { stdio: 'inherit' });
  } 