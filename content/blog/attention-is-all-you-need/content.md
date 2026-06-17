In 2017, a group of researchers from Google published a paper with a title that sounded almost too bold: **"Attention Is All You Need."** The paper introduced the **Transformer**, a neural network architecture that removed recurrence and convolution from sequence modeling and made **attention** the central operation.

At the time, most strong language systems used recurrent neural networks, especially LSTMs and GRUs. These models processed text one token at a time. That matched the natural order of language, but it also created a major bottleneck: training was slow, long-range dependencies were difficult to learn, and parallelization on modern hardware was limited.

The Transformer changed that. It showed that a model could process all tokens in a sequence together, let every token directly interact with every other token, and still produce state-of-the-art results. That single shift became the foundation for BERT, GPT, T5, Claude, Gemini, and most modern large language models.

This post explains the paper in detail: what problem it solved, how self-attention works, why multi-head attention matters, how the encoder-decoder architecture is built, and why this paper became one of the most important works in deep learning.

## The Problem Before Transformers

Language is sequential. Words come one after another, and the meaning of a word often depends on earlier or later words. Before Transformers, the natural choice for modeling sequences was a **recurrent neural network**.

An RNN reads a sequence step by step:

1. Read token 1.
2. Update hidden state.
3. Read token 2.
4. Update hidden state again.
5. Continue until the end of the sentence.

This structure is intuitive, but it has three big problems.

### 1. Training Is Hard to Parallelize

Because each step depends on the previous hidden state, an RNN cannot easily process all tokens at once. Token 10 depends on token 9, token 9 depends on token 8, and so on. This makes training slower on GPUs and TPUs, which are best at doing many independent matrix operations in parallel.

For small sequences this is acceptable. For large datasets and long sentences, it becomes a serious bottleneck.

### 2. Long-Range Dependencies Are Difficult

Consider this sentence:

> The book that the students borrowed from the library because their professor recommended it was fascinating.

To understand what **"was fascinating"** refers to, the model needs to connect that phrase back to **"book"**, even though many words appear in between. RNNs can theoretically carry information across long distances, but in practice the signal often weakens as the sequence grows.

LSTMs and GRUs improved this with gating mechanisms, but they did not remove the fundamental sequential path.

### 3. Attention Was an Add-On, Not the Main Architecture

Before the Transformer, attention mechanisms were already used in sequence-to-sequence models. In machine translation, for example, a decoder could attend to encoder states while generating each output word.

But attention was usually attached to a recurrent model. The Transformer asked a more radical question:

**What if attention itself is enough?**

## The Big Idea: Self-Attention

The core idea of the Transformer is **self-attention**.

Self-attention lets every token in a sequence look at every other token and decide how much information to take from each one. Instead of passing information through a chain of hidden states, the model builds direct connections between tokens.

For example, in the sentence:

> The animal did not cross the street because it was tired.

The word **"it"** probably refers to **"animal"**, not **"street"**. A good model should learn that relationship. Self-attention gives the model a mechanism to assign high weight to **"animal"** when processing **"it"**.

## Query, Key, and Value

The attention mechanism uses three learned representations for each token:

- **Query (Q):** What this token is looking for.
- **Key (K):** What this token offers for matching.
- **Value (V):** The actual information this token contributes.

You can think of it like search.

When a token wants context, it sends out a **query**. Every other token exposes a **key**. The model compares the query with all keys to produce attention scores. Those scores decide how much of each token's **value** should be mixed into the output.

The paper defines scaled dot-product attention as:

```txt
Attention(Q, K, V) = softmax(QK^T / sqrt(d_k))V
```

Let's unpack this formula.

### Step 1: Compare Queries and Keys

`QK^T` computes similarity between every query and every key. If a query and key point in similar directions, their dot product is large. That means the current token should pay more attention to that other token.

### Step 2: Scale the Scores

The scores are divided by `sqrt(d_k)`, where `d_k` is the dimension of the key vectors.

This scaling matters because dot products can grow large when vector dimensions are large. Very large scores push the softmax into regions where gradients become tiny. Dividing by `sqrt(d_k)` keeps training stable.

### Step 3: Apply Softmax

Softmax converts raw scores into probabilities. The weights for each query sum to 1, so the model forms a weighted mixture of relevant values.

### Step 4: Mix the Values

Finally, those attention weights are multiplied by `V`. The result is a new representation for each token, enriched with information from the rest of the sequence.

## Why This Is Powerful

The biggest advantage of self-attention is that it shortens the path between tokens.

In an RNN, information from token 1 may need to travel through token 2, token 3, token 4, and so on before reaching token 20. In a Transformer, token 20 can attend directly to token 1 in one operation.

This makes long-range relationships easier to learn.

Self-attention also lets training run in parallel. During training, the model can compute attention for all positions at the same time. This is one of the key reasons Transformers scaled so well.

## Multi-Head Attention

The paper does not use a single attention operation. It uses **multi-head attention**.

Instead of asking one attention head to learn every possible relationship, the Transformer uses several attention heads in parallel. Each head learns its own query, key, and value projections.

This gives the model multiple ways to look at the same sequence.

One head might learn subject-verb relationships. Another might track pronoun references. Another might focus on nearby words. Another might capture long-distance dependencies. The model does not need us to define these roles explicitly; it learns useful patterns during training.

After all heads compute attention, their outputs are concatenated and passed through a linear projection.

In the original paper, the base Transformer uses:

- `h = 8` attention heads
- `d_model = 512`
- `d_k = d_v = 64`

Multi-head attention is one reason Transformers are expressive: each layer can model several relationship types at once.

![Encoder and decoder architecture](/blog/attention-is-all-you-need/encoder_decoder.png)

## Encoder and Decoder Architecture

The original Transformer was designed for **machine translation**, so it uses an **encoder-decoder** architecture.

The encoder reads the input sentence. The decoder generates the output sentence.

For example:

- Input: `The cat is sleeping`
- Output: `Le chat dort`

The encoder builds a contextual representation of the English sentence. The decoder uses that representation to generate the French sentence one token at a time.

## The Encoder Stack

The encoder is made of `N = 6` identical layers in the original base model. Each encoder layer has two main sub-layers:

1. **Multi-head self-attention**
2. **Position-wise feed-forward network**

Each sub-layer is wrapped with:

- **Residual connection**
- **Layer normalization**

So the pattern is:

```txt
x -> sublayer -> add residual -> normalize
```

### Encoder Self-Attention

In the encoder, every input token can attend to every other input token. This lets the model build contextual embeddings.

For example, the word **"bank"** can mean a financial institution or the side of a river. Self-attention helps the model infer the meaning from surrounding words.

### Feed-Forward Network

After attention, each position passes through the same feed-forward network independently:

```txt
FFN(x) = max(0, xW1 + b1)W2 + b2
```

In the base Transformer:

- `d_model = 512`
- `d_ff = 2048`

This means each token representation is expanded to a larger internal dimension, transformed with a ReLU activation, and projected back.

Attention mixes information across positions. The feed-forward network transforms each position's representation.

## The Decoder Stack

The decoder is also made of `N = 6` layers, but each decoder layer has three sub-layers:

1. **Masked multi-head self-attention**
2. **Encoder-decoder attention**
3. **Position-wise feed-forward network**

The extra attention layer lets the decoder look at the encoder output.

### Masked Self-Attention

During generation, the decoder must not look at future tokens.

If the model is generating token 4, it should only see tokens 1, 2, and 3. It should not see token 5, because that would leak the answer during training.

The Transformer solves this with a **mask**. The mask blocks attention to future positions by setting those scores to a very negative value before softmax.

This preserves the auto-regressive nature of generation.

### Encoder-Decoder Attention

The second attention block lets the decoder attend to the encoder output.

In translation, this means each generated target word can look back at the source sentence. The decoder asks: "Which input words matter for the next output token?"

This replaces the older recurrent encoder-decoder attention pattern with a fully attention-based design.

## Positional Encoding

Self-attention alone has no built-in sense of order.

If you give attention the words:

```txt
I love machine learning
```

and:

```txt
learning machine love I
```

the set of tokens is the same, but the meaning is completely different. Since the Transformer processes tokens in parallel, it needs an explicit way to represent position.

The paper adds **positional encodings** to the input embeddings.

These encodings use sine and cosine functions of different frequencies:

```txt
PE(pos, 2i)   = sin(pos / 10000^(2i / d_model))
PE(pos, 2i+1) = cos(pos / 10000^(2i / d_model))
```

The exact formula is less important than the idea: each position gets a unique pattern, and nearby positions have related patterns.

The authors also experimented with learned positional embeddings and found similar results. They chose sinusoidal positional encodings because they might help the model generalize to sequence lengths longer than those seen during training.

## Why Self-Attention Was Better Than Recurrence

The paper compares self-attention with recurrent and convolutional layers using three criteria:

1. **Computational complexity per layer**
2. **Amount of sequential computation**
3. **Maximum path length between positions**

The important takeaway is this:

**Self-attention connects all positions with a constant number of sequential operations.**

That means any two tokens can interact directly. This is useful for long-range dependencies and also helps hardware utilization because the computation is more parallel.

However, self-attention has a cost: it compares every token with every other token, so the complexity is roughly `O(n^2)` with sequence length. This is why very long context windows remain expensive and why many later papers explore sparse attention, linear attention, and other approximations.

Still, for the sequence lengths used in the original machine translation tasks, self-attention was extremely effective.

## Training Setup in the Paper

The original paper trained on machine translation datasets:

- WMT 2014 English-to-German
- WMT 2014 English-to-French

The base model was trained on 8 NVIDIA P100 GPUs for about 12 hours. The big model was trained for about 3.5 days.

The paper used the Adam optimizer with a custom learning rate schedule:

```txt
lrate = d_model^-0.5 * min(step_num^-0.5, step_num * warmup_steps^-1.5)
```

This means the learning rate increases during a warmup phase and then decays over time.

The authors also used regularization techniques such as:

- Residual dropout
- Attention dropout
- Label smoothing

Label smoothing is especially interesting: instead of training the model to be 100 percent confident in the correct token, it slightly softens the target distribution. This often improves generalization.

## Results

The Transformer achieved strong results on translation tasks.

On WMT 2014 English-to-German, the big Transformer reached a BLEU score of **28.4**, outperforming previous state-of-the-art models at the time.

On WMT 2014 English-to-French, it reached a BLEU score of **41.0**, again with much lower training cost than many previous systems.

The result was not just "better score." The important point was:

**The model was better and more parallelizable.**

That combination made the architecture attractive far beyond machine translation.

## What the Paper Got Right

The most important insight was that **attention can be the main computation**, not just an alignment helper.

The paper also made several practical engineering choices that became standard:

- Residual connections around each sub-layer
- Layer normalization
- Multi-head attention
- Scaled dot-product attention
- Position-wise feed-forward layers
- Masked decoding for auto-regressive generation
- Positional encodings for order

These pieces now appear in many Transformer variants.

## How This Led to Modern LLMs

The original Transformer was an encoder-decoder model for translation. Modern LLMs adapt the same building blocks in different ways.

### BERT-Style Models

BERT uses an encoder-style Transformer. It sees tokens on both sides and learns deep bidirectional representations. This is useful for classification, search, extraction, and understanding tasks.

### GPT-Style Models

GPT uses decoder-style Transformer blocks with causal masking. It predicts the next token from previous tokens. This is the design pattern behind many modern text generation models.

### Encoder-Decoder Models

Models like T5 keep the encoder-decoder structure and frame many tasks as text-to-text generation.

The paper did not invent every modern LLM technique, but it provided the architecture that made large-scale training practical.

## Common Misunderstandings

### "Attention Is All You Need" Does Not Mean Attention Is the Only Component

The Transformer still uses embeddings, feed-forward networks, residual connections, normalization, softmax, and optimization tricks. The title means the model does not need recurrence or convolution for sequence transduction.

### Transformers Still Care About Order

They do not process tokens recurrently, but positional encodings inject order information. Without positional information, the model would lose the difference between many reordered sentences.

### Self-Attention Is Powerful but Not Free

The quadratic cost in sequence length is real. This is why context length remains expensive and why efficient attention research continues.

## Why This Paper Still Matters

The paper matters because it changed the default architecture for language modeling.

Before 2017, recurrent networks were the natural answer for sequences. After this paper, attention-based models became the direction of travel. Once researchers realized Transformers could scale, the field moved rapidly toward pretraining, larger datasets, larger models, and eventually instruction-tuned assistants.

The impact is difficult to overstate:

- Machine translation improved.
- Language understanding improved.
- Text generation improved.
- Code generation became practical.
- Multimodal models adopted Transformer blocks.
- LLMs became the core interface for modern AI applications.

Many details have changed since 2017, but the central idea remains: let tokens communicate through attention, and scale the system.

## Conclusion

**"Attention Is All You Need"** is one of the most important papers in modern AI because it replaced slow sequential processing with a parallel, attention-based architecture.

The Transformer made it easier to train on large datasets, capture long-range dependencies, and use modern hardware efficiently. It began as a machine translation model, but its influence now reaches almost every part of AI: chatbots, coding agents, search, summarization, image generation, speech systems, and multimodal assistants.

If you want to understand modern AI, this paper is one of the best places to start. Not because every detail is easy, but because the core idea is surprisingly clear:

**Every token should be able to decide which other tokens matter.**

That idea changed everything.
