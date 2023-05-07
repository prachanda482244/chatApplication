import bcrypt from 'bcryptjs'

export const generateHashCode = async (password) => {
    let hashCode = await bcrypt.hash(password, 10)
    return hashCode
}

export const compareHashCode = (password, hashCode) => {
    return bcrypt.compare(password, hashCode)
}