export const state = () => ({
    isLoggedin: false,
    projects:[]
})

export const mutations = {
    addProject(state,payload) {
        state.projects.push(payload)
    },
    removeProject(state,payload) {
        state.projects = removeByAttr(state.projects, 'appId', payload);   
    },

}
let removeByAttr = function (arr, attr, value) {
    var i = arr.length;
    while (i--) {
        if (arr[i]
            && arr[i].hasOwnProperty(attr)
            && (arguments.length > 2 && arr[i][attr] === value)) {

            arr.splice(i, 1);

        }
    }
    return arr;
}