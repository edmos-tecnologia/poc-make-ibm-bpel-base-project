/**
 * 
 * @author Eduardo Ramos
 */

const MODULE_SUFFIX = '-module';
const LIBRARY_SUFFIX = '-lb';
const SCA_MODULE_FILENAME = 'sca.module';
const SCA_LIBRARY_FILENAME = 'sca.library';

var builder = require('xmlbuilder');
var fs = require('fs');
var args = process.argv.slice(2);

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
createBaseBpelProject = (dirWrkSpace) => {
    //------------------------------------------------
    // Cria estrutura de Diretórios do Projeto BPEL
    //------------------------------------------------
    fs.mkdir(dirWrkSpace, {}, () => {});
    createBaseBpelModule(dirWrkSpace);
    createBaseBpelLibrary(dirWrkSpace);
}

/**
 * @argument dirWrkSpace
 * @author Eduardo Ramos
 */
createBaseBpelModule = (dirWrkSpace) => {
    var moduleName = dirWrkSpace + MODULE_SUFFIX;
    var dirModule = dirWrkSpace + '/' + moduleName;
    var scaModule = createScaXml(moduleName);
    var projectXml = createModuleProjectXml(moduleName);
    
    fs.mkdir(dirModule, {}, () => {});
    fs.writeFile(dirModule + '/' + SCA_MODULE_FILENAME,scaModule, () => {});
    fs.writeFile(dirModule + '/.project',projectXml, () => {});
}

/**
 * 
 * @argument dirWrkSpace
 * @author Eduardo Ramos
 */
createBaseBpelLibrary = (dirWrkSpace) => {
    var libraryName = dirWrkSpace + LIBRARY_SUFFIX;
    var dirLib = dirWrkSpace + '/' + libraryName;
    var scaLib = createScaXml(libraryName);
    var projectXml = createLibraryProjectXml(libraryName);

    fs.mkdir(dirLib, {}, () => {});

    fs.writeFile(dirLib + '/' + SCA_LIBRARY_FILENAME,scaLib, () => {});
    fs.writeFile(dirLib + '/.project',projectXml, () => {});
}

main(process.argv);