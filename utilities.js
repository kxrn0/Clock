export function map(value, start1, end1, start2, end2) {
    return start2 + (end2 - start2) * (value - start1) / (end1 - start1);
}
  
export function create_ul(items, content) {
    const ul = document.createElement("ul");

    for (let i = 0; i < items; i++) {
        const li = document.createElement("li");

        for (let element of content[i]) {
            const htmlElem = document.createElement(element.type);

            for (let attribute of element.attributes) {
                htmlElem[attribute.attribute] = attribute.value;
            }
            li.append(htmlElem)
        }
        ul.append(li)
    }
    return ul;
}