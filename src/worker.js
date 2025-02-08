import { pipeline, TextStreamer } from '@huggingface/transformers';

class MyTranslationPipeline {
    static task = 'translation';
    static model = 'Xenova/nllb-200-distilled-600M';
    static instance = null;

    static async getInstance(progress_callback = null) {
        this.instance ??= pipeline(this.task, this.model, { progress_callback });
        return this.instance;
    }
}

self.addEventListener('message', async (event) => {
    const translator = await MyTranslationPipeline.getInstance(x => {
        self.postMessage(x);
    });

    const streamer = new TextStreamer(translator.tokenizer, {
        skip_prompt: true,
        skip_special_tokens: true,
        callback_function: function (text) {
            self.postMessage({
                status: 'update',
                output: text
            });
        }
    });

    const output = await translator(event.data.text, {
        tgt_lang: event.data.tgt_lang,
        src_lang: event.data.src_lang,

        streamer,
    });

    self.postMessage({
        status: 'complete',
        output,
    });
});