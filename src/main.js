
try
{
    module.exports = require(`../build/Release/internal.node`);
}
catch
{
    module.exports = undefined;
}