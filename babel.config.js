module.exports = {
    presets: [
        // Definindo a conversão para a versão do Node no computador onde é feito o build
        ['@babel/preset-env', { targets: { node: 'current' } }],
        '@babel/preset-typescript'
    ],
    plugins: [
        ['module-resolver', {
            // Definindo os caminhos criados para a aplicação, que estão na variável "paths" do "tsconfig.json"
            alias: {
                '@modules': './src/modules',
                '@config': './src/config',
                '@shared': './src/shared'
            }
        }],
        // Plugin necessário devido à utilização dos 'decorators'
        'babel-plugin-transform-typescript-metadata',
        ['@babel/plugin-proposal-decorators', { 'legacy': true }],
        ['@babel/plugin-proposal-class-properties', { 'loose': true }]
    ],
}
