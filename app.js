const app = require('./server')

const PORT=8000
app.listen(PORT, () => {
    console.log(`Server now listening on port ${PORT}`);
});
