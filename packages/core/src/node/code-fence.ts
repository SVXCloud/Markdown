import { textblockTypeInputRule } from 'prosemirror-inputrules';
import { NodeSpec, NodeType } from 'prosemirror-model';
import { Node } from '../abstract/node';
import { ParserSpec } from '../parser/types';
import { SerializerNode } from '../serializer/types';

export class CodeFence extends Node {
    name = 'fence';
    schema: NodeSpec = {
        content: 'text*',
        group: 'block',
        marks: '',
        defining: true,
        code: true,
        attrs: {
            language: {
                default: '',
            },
        },
        parseDOM: [
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            { tag: 'pre', preserveWhitespace: 'full', getAttrs: (dom: any) => ({ language: dom.dataset.language }) },
        ],
        toDOM: (node) => [
            'div',
            {
                'data-language': node.attrs.language,
                class: 'code-fence',
                contentEditable: 'false',
            },
            ['pre', ['code', { spellCheck: 'false' }, 0]],
        ],
    };
    parser: ParserSpec = {
        block: this.name,
        getAttrs: (tok) => ({ language: tok.info }),
    };
    serializer: SerializerNode = (state, node) => {
        state.write('```' + node.attrs.language + '\n');
        state.text(node.textContent);
        state.ensureNewLine();
        state.write('```');
        state.closeBlock(node);
    };
    inputRules = (nodeType: NodeType) => [textblockTypeInputRule(/^```$/, nodeType)];
}
