const autoBind = require('auto-bind');
class Service {

    constructor(repo) {
        this.repo = repo;
        autoBind(this);
    }
    async getAll(query) {
        try {
            return await this.repo.getAll(query);
        }
        catch (error) {
            throw error;
        }
    }

    async get(id) {
        try {
            const item = await this.repo.get(id);
            if (!item) {
                const error = new Error('Item not found');
                error.statusCode = 404;
                throw error;
            }
            return item;
        } catch (error) {
            error.statusCode = 404;
            throw error;
        }
    }

    async insert(data) {
        try {
            const item = await this.repo.insert(data);

            if (item) {
                return item;
            }
            throw new Error('Something wrong happened');
        } catch (error) {
            throw error;
        }
    }

    async update(id, data) {
        try {
            const item = await this.repo.update(id, data, { 'new': true });
            //return new HttpResponse(item);
        } catch (error) {
            throw error;
        }
    }

    async delete(id) {
        try {
            const item = await this.repo.delete(id);

            if (!item) {
                const error = new Error('Item not found');
                error.statusCode = 404;
                throw error;
            } else {
                //   return new HttpResponse(item, { 'deleted': true });
            }
        } catch (error) {
            throw error;
        }
    }
}
module.exports = Service;