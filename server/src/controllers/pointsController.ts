import { Request, Response } from 'express';
import knex from '../database/connection';

class PointsController {
    async create(request: Request, response: Response) {
        let trx = await knex.transaction();
        let { name,
            email,
            whatsapp,
            city,
            uf,
            latitude,
            longitude,
            items
        } = request.body;
        let point = {
            image: 'https://images.unsplash.com/photo-1528323273322-d81458248d40?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
            name,
            email,
            whatsapp,
            city,
            uf,
            latitude,
            longitude
        }
        let insertedIds = await trx('points').insert(point);

        let point_id = insertedIds[0];

        const pointItems = items.map((item_id: number) => {
            return {
                item_id,
                point_id
            };
        })

        await trx('point_items').insert(pointItems);
        await trx.commit();
        return response.json({
            point_id,
            ...point
        });
    }
    async show(request: Request, response: Response) {
        let { id } = request.params;
        let items = await knex('items')
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', id)
            .select('items.title');
        let point = await knex('points').where('id', id).first();
        return point ? response.json({ point, items }) : response.status(400).json({ message: "Point not found" });

    }
    async index(request: Request, response: Response) {
        let { city, uf, items } = request.query;
        let parsedItems = String(items)
            .split(',')
            .map(item => Number(item.trim()));
        const points = await knex('points')
        .join('point_items','points.id','=','point_items.point_id')
        .whereIn('point_items.item_id',parsedItems)
        .where('city',String(city))
        .where('uf',String(uf))
        .distinct()
        .select('points.*');
        return response.json(points);

    }
}

export default PointsController;