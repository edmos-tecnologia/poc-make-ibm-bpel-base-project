/**
 * 
 * @author Eduardo Ramos
 */

const constantes = require('./lib/Constantes');

var builder = require('xmlbuilder');
var fs = require('fs');
var args = process.argv.slice(2);
var basePath = (process.env.BPEL_BASE_PATH || '');

console.log('Argumentos ' + JSON.stringify(args));

/**
 * @argument args
 * @author Eduardo Ramos
 */
main = (args) => {
    var appName = args[0];
    createBaseBpelProject(appName);
}

/**
 * @argument name
 * @argument comment
 * @argument buildCommands
 * @argument natures
 * @returns xml
 * @author Eduardo Ramos
 */
createIIDProjectXml = (name, comment = '', buildCommands = [], natures = []) => {
    var buildSpec = makeBuildSpec(buildCommands);
    var obj = {
        projectDescription : {
            name: name,
            comment: comment,
            projects: {

            },
            buildSpec: buildSpec,
            natures: {
                nature: natures
            }
        }
    }
    var xml = builder.create(obj, {encoding: 'UTF-8'}).end({pretty:true});
    console.log(xml);
    return xml;
}

/**
 * @argument name
 * @argument arguments
 * @returns Object
 * @author Eduardo Ramos
 */
makeBuildCommand = (name, arguments = {}) => {
    return {
        name: name,
        arguments: arguments
    };
}

/**
 * @argument buildCommands
 * @returns Object
 * @author Eduardo Ramos
 */
makeBuildSpec = (buildCommands = []) => {
    var buildSpec = {
        buildCommand: []
    }

    buildCommands.forEach(element => {
        buildSpec.buildCommand.push(makeBuildCommand(element));
    });

    return buildSpec;
}

/**
 * @argument moduleName
 * @returns ModuleProjectXml
 * @author Eduardo Ramos
 */
createModuleProjectXml = (moduleName) => {
    var buildCommands = [
        'org.eclipse.wst.common.project.facet.core.builder',
        'com.ibm.wbit.project.wbimodulebuilder_prejdt',
        'org.eclipse.jdt.core.javabuilder',
        'com.ibm.wbit.project.wbimodulebuilder_postjdt'
    ];

    var natures = [
        'org.eclipse.wst.common.project.facet.core.nature',
        'org.eclipse.jdt.core.javanature',
        'org.eclipse.wst.common.modulecore.ModuleCoreNature',
        'org.eclipse.jem.workbench.JavaEMFNature',
        'com.ibm.ws.sca.rapiddeploy.style.SCAProjectNature',
        'com.ibm.wbit.project.generalmodulenature'
    ];
    var moduleProjectXml = createIIDProjectXml(moduleName, 'Comment', buildCommands, natures);
    return moduleProjectXml;
}

/**
 * @argument libraryName
 * @returns LibraryProjectXml
 * @author Eduardo Ramos
 */
createLibraryProjectXml = (libraryName) => {
    var buildCommands = [
        'org.eclipse.wst.common.project.facet.core.builder',
        'com.ibm.wbit.project.wbimodulebuilder_prejdt',
        'org.eclipse.jdt.core.javabuilder',
        'com.ibm.wbit.project.wbimodulebuilder_postjdt'
    ];

    var natures = [
        'org.eclipse.wst.common.project.facet.core.nature',
        'org.eclipse.jdt.core.javanature',
        'org.eclipse.wst.common.modulecore.ModuleCoreNature',
        'org.eclipse.jem.workbench.JavaEMFNature',
        'com.ibm.ws.sca.rapiddeploy.style.SCAProjectNature',
        'com.ibm.wbit.project.sharedartifactmodulenature'
    ];
    var libraryProjectXml = createIIDProjectXml(libraryName, 'Comment', buildCommands, natures);
    return libraryProjectXml;
}

/**
 * @argument name
 * @returns SCA Xml
 * @author Eduardo Ramos
 */
createScaXml = (name) => {
    var obj = {
        'scdl:module': {
            '@xmlns:scdl' : 'http://www.ibm.com/xmlns/prod/websphere/scdl/6.0.0',
            '@name': name
        }
    };
    var xml = builder.create(obj, {encoding: 'UTF-8'}).end({pretty:true});
    console.log(xml);
    return xml;
}

/**
 * @argument dirWrkSpace
 * @author Eduardo Ramos
 */
createBaseBpelProject = (appName) => {
    //------------------------------------------------
    // Cria estrutura de Diretórios do Projeto BPEL
    //------------------------------------------------
    
    //var dirWrkSpace = basePath + '/' + appName;
    var dirWrkSpace = appName;

    fs.mkdir(dirWrkSpace, {}, () => {
        console.log('Criando diretórios para a aplicação ' + appName);
    });

    createBaseBpelModule(dirWrkSpace);
    createBaseBpelLibrary(dirWrkSpace);
}

/**
 * @argument dirWrkSpace
 * @author Eduardo Ramos
 */
createBaseBpelModule = (dirWrkSpace) => {
    var moduleName = dirWrkSpace + constantes.MODULE_SUFFIX;
    var dirModule = dirWrkSpace + '/' + moduleName;
    var scaModule = createScaXml(moduleName);
    var projectXml = createModuleProjectXml(moduleName);
    
    fs.mkdir(dirModule, {}, () => {
        console.log('Criando módulo ' + moduleName);
    });
    
    fs.writeFile(dirModule + '/' + constantes.SCA_MODULE_FILENAME,scaModule, () => {
        console.log('Criando arquivo ' + constantes.SCA_MODULE_FILENAME);
    });

    fs.writeFile(dirModule + '/' + constantes.PROJECT_FILENAME,projectXml, () => {
        console.log('Criando arquivo ' + constantes.PROJECT_FILENAME);
    });
}

/**
 * 
 * @argument dirWrkSpace
 * @author Eduardo Ramos
 */
createBaseBpelLibrary = (dirWrkSpace) => {
    var libraryName = dirWrkSpace + constantes.LIBRARY_SUFFIX;
    var dirLib = dirWrkSpace + '/' + libraryName;
    var scaLib = createScaXml(libraryName);
    var projectXml = createLibraryProjectXml(libraryName);

    fs.mkdir(dirLib, {}, () => {
        console.log('Criando Library ' + libraryName);
    });

    fs.writeFile(dirLib + '/' + constantes.SCA_LIBRARY_FILENAME,scaLib, () => {
        console.log('Criando arquivo ' + constantes.SCA_LIBRARY_FILENAME);
    });

    fs.writeFile(dirLib + '/' + constantes.PROJECT_FILENAME,projectXml, () => {
        console.log('Criando arquivo ' + constantes.PROJECT_FILENAME);
    });
}

main(args);