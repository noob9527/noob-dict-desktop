import { delay } from '../../../common/utils/promise-extension';

export const textPlaceholder = `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus aliquid aperiam asperiores blanditiis
    consequatur, deleniti doloremque earum excepturi maxime molestiae molestias neque omnis optio perspiciatis
    praesentium quaerat quam quo sunt.
  Aspernatur consequuntur dolores est explicabo fugit harum in incidunt iste nostrum officiis porro, quam,
    quos saepe sequi tempora tenetur vel, voluptatem? Aperiam architecto dolores officia repellendus voluptatibus!
    Assumenda harum, perferendis?
  Culpa eum fuga libero, nulla quae quis quod sed similique! Aliquid animi est eum, itaque praesentium
    reiciendis unde. Debitis deleniti, distinctio doloribus enim error facere iste itaque neque repellendus sequi.
  Accusantium ad, aliquam beatae blanditiis commodi consequatur delectus dolore et fugiat, illum ipsa modi
    perferendis perspiciatis placeat quas quibusdam quidem quod ratione recusandae rem rerum sit voluptas.
    Consequuntur, error reiciendis.
  Ab cumque delectus dolore, doloremque doloribus ducimus ex fugiat harum id itaque laboriosam maiores
    nesciunt porro, quam quas, quibusdam ratione voluptatem? Commodi doloribus eligendi ipsa sint. Blanditiis
    cumque ea soluta.
`

export function chunkSubstr(str: string, size: number): string[] {
  const numChunks = Math.ceil(str.length / size)
  const chunks = new Array(numChunks)

  for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
    chunks[i] = str.substring(o, size + o)
  }

  return chunks
}

export async function* mockStream(raw: string) {
  const chunks = chunkSubstr(textPlaceholder, 30)
  for (const chunk of chunks) {
    await delay(100)
    yield chunk
  }
}
