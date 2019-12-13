/**
 * 
 * @author Eduardo Ramos
 */

const constantes = require('./Constantes');
const builder = require('xmlbuilder');
const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

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
        projectDescription: {
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
    var xml = builder.create(obj, { encoding: constantes.ENCODING_UTF_8 }).end({ pretty: true });
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
            '@xmlns:scdl': 'http://www.ibm.com/xmlns/prod/websphere/scdl/6.0.0',
            '@name': name
        }
    };
    var xml = builder.create(obj, { encoding: 'UTF-8' }).end({ pretty: true });
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
        console.log('Módulo ' + moduleName + ' Criado com Sucesso em ' + dirModule);
    });

    fs.writeFile(dirModule + '/' + constantes.SCA_MODULE_FILENAME, scaModule, () => {
        console.log('Arquivo ' + constantes.SCA_MODULE_FILENAME + ' Criado com Sucesso em ' + dirModule);
    });

    fs.writeFile(dirModule + '/' + constantes.PROJECT_FILENAME, projectXml, () => {
        console.log('Arquivo ' + constantes.PROJECT_FILENAME + ' Criado com Sucesso em ' + dirModule);
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
        console.log('Library ' + libraryName + ' Criada com Sucesso em ' + dirLib);
    });

    fs.writeFile(dirLib + '/' + constantes.SCA_LIBRARY_FILENAME, scaLib, () => {
        console.log('Arquivo ' + constantes.SCA_LIBRARY_FILENAME + ' Criado com Sucesso em ' + dirLib);
    });

    fs.writeFile(dirLib + '/' + constantes.PROJECT_FILENAME, projectXml, () => {
        console.log('Arquivo ' + constantes.PROJECT_FILENAME + ' Criado com Sucesso em ' + dirLib);
    });
}

/**
 * @argument path
 * @author Eduardo Ramos
 */
readXmlFileAsJson = (path, callback) => {
    let parser = new xml2js.Parser();

    fs.readFile(path, constantes.ENCODING_UTF_8, (err, data) => {
        var _json;

        if (err) {
            console.log("[Function readXmlFile<" + path + ">] Erro ao ler arquivo XML em " + path + ".");
            throw err;
        }

        parser.parseString(data, (err, json) => {
            if (err) {
                console.log("[Function readXmlFile<" + path + ">] Erro ao ler arquivo XML em " + path + ".");
                throw err;
            }
            _json = json;
        });
        callback(_json);
    });

}

/**
 * @author Eduardo Ramos
 */
getScaFileFromModule = (appName, moduleName) => {
    var moduleDir = appName + '/' + moduleName;
    var scaPath = moduleDir + '/' + constantes.SCA_MODULE_FILENAME;
    return readXmlFileAsJson(scaPath);
}

renameBpelApplication = (appName, newAppName) => {
    var newModuleName = newAppName + constantes.MODULE_SUFFIX;
    var appModulePath = appName + '/' + appName + constantes.MODULE_SUFFIX;
    var newModulePath = newAppName + '/' + newModuleName;
    // var moduleScaPath = appModulePath + '/' + constantes.SCA_MODULE_FILENAME;
    var newModuleScaPath = newModulePath + '/' + constantes.SCA_MODULE_FILENAME;
    
    //----------------------------------------------
    // Create new SCA Module file for Application
    //----------------------------------------------
    var xmlModuleSca = createScaXml(newAppName);

    //----------------------------------------------
    // Create new Application and Module folders
    //----------------------------------------------
    fs.mkdir(newAppName, {}, (err) => { });
    fs.mkdir(newModulePath, {}, (err) => { });
    fs.writeFile(newModuleScaPath, xmlModuleSca, (err) => { });

    //----------------------------------------------
    // Copy Libraries from old Application to new Application
    //----------------------------------------------
    fs.readdir(appModulePath, function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }
        //listing all files using forEach
        files.forEach(function (file) {
            // Do whatever you want to do with the file
            console.log(file);
        });
    });
}

BpelBuilder = {
    createBaseBpelProject: createBaseBpelProject,
    createBaseBpelModule: createBaseBpelModule,
    createBaseBpelLibrary: createBaseBpelLibrary,
    renameBpelApplication: renameBpelApplication
}
module.exports = BpelBuilder;