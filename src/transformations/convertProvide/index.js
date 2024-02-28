const transform = ({ root, j }) => {
    let provideSyntax = ''
    root
        .find(j.Property, {
            key: { name: "provide" },
        }).forEach(path => {
            path.value.value.body.body[0].argument.properties.forEach(property => {
                provideSyntax += createProvideSyntax(j,property) + '\n\n'
            })
        })

    return provideSyntax
}

const createProvideSyntax = (j,property) => {
    if (property.value.type === 'MemberExpression') {
        return `provide('${property.key.name}', ${property.value.property.name})`
    } else if (property.value.type === 'FunctionExpression') {
        return `provide('${property.key.name}', (${j(property.value.params).toSource()}) => ${j(property.value.body).toSource()})`
    } else if (property.value.type === 'Identifier') {
        return `provide('${property.key.name}', ${property.value.name})`
    } else {
        return `//Nuxt3TODO please review provide 
provide('${property.key.name}', ${property.value})`
    }
}

module.exports = transform