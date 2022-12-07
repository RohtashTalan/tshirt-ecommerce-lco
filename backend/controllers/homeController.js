
exports.home = (req, res) => {
res.status(200).json({
    success:true,
    messsage:'hello from home page api'
})
}
