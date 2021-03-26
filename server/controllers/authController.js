const bcrypt = require('bcryptjs');

module.exports = {
  register: async (req, res) => {
    const {username, password, isAdmin} = req.body;
    const db = req.app.get('db');

      const result = await db.get_user([username]);

      const existingUser = result[0];

      if(existingUser) {
        return res.status(409).send('Username Taken')
      };

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);

      const registeredUser = await db.register_user([isAdmin, username, hash]);

      const user = registeredUser[0];
      
      req.session.user = {isAdmin: user.is_admin, username: user.username, id: user.id};

      res.status(200).send(req.session.user);
  },
  login: async (req, res) => {
    const {username, password} = req.body;

    const foundUser = await req.app.get('db').get_user([username]);
      if(!foundUser){
        return (res.status(401).send('User not found.'))
      };

    const isAuthenticated = bcrypt.compareSync(password, user.hash);
      if(!isAuthenticated){
        return('Incorrect password.')
      };
    req.session.user = {isAdmin: user.is_admin, id: user.id, username: user.username};
    res.status(200).send(req.session.user);
  },
  logout: async (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
  },
}