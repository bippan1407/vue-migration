const transform = ({ root, j }) => {
    let injectSyntax = ''
    root
        .find(j.Property, {
            key: { name: "inject" },
        }).forEach(path => {
            path.value.value.elements.forEach(element => {
                injectSyntax+=`const ${element.value} = inject('${element.value}')\n`
            })
        })
    return injectSyntax
}

module.exports = transform