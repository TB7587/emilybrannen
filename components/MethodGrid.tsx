import type { MethodNode } from "@/lib/content";

// The "read left to right" recipe table: ingredients down the left, and each box
// to the right is an action on everything to its left. Built from the `method`
// tree in a recipe's frontmatter.

type Laid = { node: MethodNode; first: number; span: number; height: number; children: Laid[] };
type Cell = { laid: Laid; colSpan: number; isLast: boolean };

function measure(node: MethodNode, counter: { n: number }): Laid {
  if (typeof node === "string") return { node, first: counter.n++, span: 1, height: 0, children: [] };
  const children = node.with.map((c) => measure(c, counter));
  return {
    node,
    first: children[0].first,
    span: children.reduce((sum, c) => sum + c.span, 0),
    height: Math.max(...children.map((c) => c.height)) + 1,
    children,
  };
}

function place(laid: Laid, parentHeight: number, rows: Cell[][], isLast: boolean) {
  for (const child of laid.children) place(child, laid.height, rows, false);
  // A box stretches right until the next action that uses it begins.
  rows[laid.first].push({ laid, colSpan: parentHeight - laid.height, isLast });
}

/** "4 cans | corn" -> ["4 cans", "corn"]; no bar means no separate amount. */
export function splitIngredient(text: string): [string, string] {
  const i = text.indexOf("|");
  return i === -1 ? ["", text.trim()] : [text.slice(0, i).trim(), text.slice(i + 1).trim()];
}

export function MethodGrid({ method, title }: { method: MethodNode; title: string }) {
  const counter = { n: 0 };
  const root = measure(method, counter);
  const rows: Cell[][] = Array.from({ length: counter.n }, () => []);
  place(root, root.height + 1, rows, true);

  return (
    <div className="method-scroll overflow-x-auto">
      <table className="method-grid w-full border-collapse text-left text-[0.84rem] sm:text-[0.95rem]" aria-label={`${title}: ingredients and method, read left to right`}>
        <tbody>
          {rows.map((cells, r) => (
            <tr key={r}>
              {cells.map(({ laid, colSpan, isLast }, c) => {
                if (typeof laid.node === "string") {
                  const [amount, name] = splitIngredient(laid.node);
                  return (
                    <th key={c} scope="row" colSpan={colSpan} className="border border-ink bg-oat px-2 py-2 text-left align-middle font-normal sm:px-3">
                      <span className="flex gap-2 leading-snug">
                        {amount && <span className="w-[3.4rem] shrink-0 font-semibold text-barn sm:w-[4.5rem]">{amount}</span>}
                        <span>{name}</span>
                      </span>
                    </th>
                  );
                }
                return (
                  <td
                    key={c}
                    rowSpan={laid.span}
                    colSpan={colSpan}
                    className={`min-w-[3.6rem] border border-ink px-1.5 py-2 text-center sm:px-3 align-middle ${isLast ? "bg-[#e9eee0]" : "bg-white"}`}
                  >
                    <span className="block font-display text-[1.1rem] font-semibold leading-tight sm:text-[1.3rem]">{laid.node.do}</span>
                    {laid.node.note && <span className="mt-1 block text-[0.74rem] leading-snug text-ink-soft sm:text-[0.82rem]">{laid.node.note}</span>}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
