# Guia de Desenvolvimento

## Scripts Disponíveis

### Hot Reload com TSX

Para desenvolvimento com hot reload automático:

```bash
npm run dev
```

Este comando usa `tsx watch` que:
- Monitora mudanças nos arquivos TypeScript
- Reinicia automaticamente o servidor quando detecta alterações
- Compila TypeScript em tempo real usando esbuild (muito mais rápido que ts-node)

### Depuração

#### Depuração Simples (sem hot reload)
```bash
npm run debug
```

#### Depuração com Hot Reload
```bash
npm run debug:watch
```

Ambos os comandos de depuração:
- Iniciam o servidor com Node.js Inspector habilitado
- Escutam na porta 9229 em todas as interfaces (0.0.0.0:9229)
- Permitem conectar debuggers externos (VS Code, Chrome DevTools, etc.)

## Conectando o Debugger

### VS Code
1. Abra o projeto no VS Code
2. Vá para a aba "Run and Debug" (Ctrl+Shift+D)
3. Clique em "create a launch.json file"
4. Use a configuração:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug TSX",
      "type": "node",
      "request": "attach",
      "port": 9229,
      "restart": true,
      "localRoot": "${workspaceFolder}",
      "remoteRoot": "${workspaceFolder}"
    }
  ]
}
```

### Chrome DevTools
1. Execute `npm run debug` ou `npm run debug:watch`
2. Abra o Chrome e vá para `chrome://inspect`
3. Clique em "Open dedicated DevTools for Node"

### Outros Debuggers
Qualquer debugger que suporte o protocolo Node.js Inspector pode se conectar na porta 9229.

## Vantagens do TSX

- **Velocidade**: Compilação muito mais rápida que ts-node
- **Hot Reload**: Reinicialização automática em mudanças
- **Compatibilidade**: Suporte completo a ESM e CommonJS
- **Configuração**: Mínima configuração necessária
- **Debugging**: Suporte nativo ao Node.js Inspector

## Configuração

O arquivo `tsx.config.json` contém configurações otimizadas:
- Ignora pastas desnecessárias no watch mode
- Configura esbuild para Node.js 22
- Otimiza para desenvolvimento 