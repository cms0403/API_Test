const jwt = require('jsonwebtoken');
const SECRET_KEY = 'Hello';

const authMiddleware = async function(request, response, next) {
	const accessToken = request.headers['token'];
	if (accessToken == null) {
		response.status(403).json({success:false, errormessage:'토큰이 존재하지않습니다.'});
	} else {
		try {
			const tokenInfo = await new Promise((resolve, reject) => {
				jwt.verify(accessToken, SECRET_KEY, 
					(err, decoded) => {
						if (err) {
							reject(err);
						} else {
							resolve(decoded);
						}
					});
			});
			request.tokenInfo = tokenInfo;
			next();
		} catch(err) {
			response.status(403).json({success:false, errormessage:'토큰인증 실패'});
		}
	}
}

module.exports = authMiddleware;