const args = process.argv.slice(2);
const bpelBuilder = require('./lib/ibm.bpel.builder');

const optionsEnum = {
    CREATE_APP_OPTION: '-a',
    CREATE_MODULE_OPTION: '-m',
    RENAME_APP_OPTION: '-ra',
    RENAME_MODULE_OPTION: '-rm'
}

console.log('Argumentos ' + JSON.stringify(args));

performOption = (option, args) => {
    switch (option) {
        case optionsEnum.CREATE_APP_OPTION:
            bpelBuilder.createBaseBpelProject(args[1]);
            break;
        case optionsEnum.CREATE_MODULE_OPTION:
            bpelBuilder.createBaseBpelModule (args[1], args[2]);
            break;
        case optionsEnum.RENAME_APP_OPTION:
            bpelBuilder.renameBpelApplication(args[1], args[2]);
            break;
    }
}

/**
 * @argument args
 * @author Eduardo Ramos
 */
main = (args) => {
    var appName = args[1];
    performOption(args[0], args);
    // bpelBuilder.renameBpelApplication(appName, 'new-app-name');
}

main(args);