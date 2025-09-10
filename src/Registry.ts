export default class Registry {
    dependencies: { [name: string]: any };
    private static instance: Registry;

    private constructor() {
        this.dependencies = {};
    }

    provide(name: string, dependency: any) {
        this.dependencies[name] = dependency;
    }

    inject(name: string) {
        if( !this.dependencies[name]) throw new Error(`Dependency ${name} not found`);
        return this.dependencies[name];
    }

    /*
    * Como o Registry vai ser um objeto "well known", ou seja, todas as classes conhecem ele,
    * podemos aplicar o padrão singleton:
    * 1- referencia estática (static)
    * 2- priva a referência e o construtor
    * 3- cria uma função estática que retorna a instância
    * */
    static getInstance () {
        if (!Registry.instance) {
            Registry.instance = new Registry();
        }
        return Registry.instance;
    }

}

/*
* Por que esta função foi criado?
* Esta função usa o "experimentalDecorators" habilitado no tsconfig.json para criar um "decorator do ts" -> que é uma função que retorna uma função
* Por no node, quando importamos um módulo ele já tenta criar o objeto, a injeção pode quebrar. Então usamos o padrão de projeto Proxy
* para intermediar essa chamada
* */
export function inject (name: string) {
    return function (target: any, propertyKey: string) {
        target[propertyKey] = new Proxy({}, {
            get (_: any, propertyKey: string) {
                const dependency = Registry.getInstance().inject(name);
                return dependency[propertyKey];
            }
        });
    }
}