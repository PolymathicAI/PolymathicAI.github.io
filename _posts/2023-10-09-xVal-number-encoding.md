---
layout: post
title: "xVal: A continuous number encoding for LLMs"
shorttitle: "xVal Number Encoding"
date: 2023-10-05 10:02
image: xVal.jpg
smallimage: xVal-s.jpg
blurb: We introduce xVal, a new number encoding scheme for LLMs. Using xVal with a modified number inference method makes LLMs continuous function approximators. This makes them have a better inductive bias for data analysis in scientific domains.
shortblurb: We introduce xVal, a new number encoding scheme for LLMs. Using xVal with a modified number inference method makes LLMs continuous function approximators. This makes them have a better inductive bias for data analysis in scientific domains.
---

Large Language Models (LLMs) these days can write essays, summarize research papers, generate recipes and travel itineraries, and debug your code — but ask ChatGPT to multiply two four-digit numbers, and it will fail over 90% of the time.

Why? It turns out that numbers are quite different from other kinds of language! Numbers have specific meanings, but unlike letters or words, these meanings exist on a continuous scale with infinitely many values that operate using a complex system of rules.  

We shouldn’t expect LLMs to be perfect calculators. But there are nevertheless some compelling reasons why we might want to tackle this challenge as we envision how the act of doing science could change in the next 5-10 years. 
For instance, how might science change if scientists had access to an AI model trained on a massive variety of scientific data? LLMs achieve a fluency with language-based tasks, even ones they weren’t explicitly trained on, because they have been trained on over an astounding amount of text data from diverse sources on the Internet. Would an AI model of such scale specializing in numerical data open similarly innovative paths of inquiry for scientists in the near future?

One key reason why we haven’t yet seen major models like this emerge is that scientific datasets come in highly specialized formats that require domain expertise to understand. Most of the so-called “foundation models” we see shaping the public’s experience of AI today are experts in a single data format: text, images, video, etc. Similarly, AI models in science today are carefully constructed to reflect the highly-curated datasets on which they are trained. A model spanning scientific domains, however, needs to be very flexible — as flexible as an LLM, yet grounded in a rigorous sense of numerics. 

Every proposal for how to treat numbers in language models struggles with how to translate the infinite space of numbers into a finite number of vocabulary elements. LLMs break down language into pieces called “tokens”, sort of like tiles in a game of Scrabble. Adding numbers into the mix is like adding an infinite number of Scrabble tiles, making the game impossible to play. Existing strategies show improved predictions on problems whose answers lie within the training dataset, but none can effectively generalize outside of numbers already seen. 

For this reason, we developed xVal: a continuous way to encode numbers in language models for scientific applications that uses just a single token to represent any number. This strategy has three major benefits: 
Continuity: It embeds key information about how numbers continuously relate to one another, making its predictions more appropriate for scientific applications. 
Interpolation: It makes better out-of-distribution predictions than other numerical encodings. 
Efficiency: By using just a single token to represent any number, it requires less memory, compute resources, and training time to achieve good results.
xVal works by treating numbers differently than other kinds of language. Each number in a text dataset is pre-processed: its value is stored in a separate vector, and in its place, we leave a single token: [NUM]. We then encode the pre-processed text into a finite series of word tokens, but multiply the embeddings of any [NUM] tokens by their corresponding value. When the model is asked to decode a [NUM] token, we use a dedicated token head in our transformer architecture to predict that token’s numerical value as a scalar value trained with Mean Squared Error (MSE) loss. 


 
We run a series of experiments to test how xVal performs on various datasets in comparison with four other numerical encoding strategies defined in [1] and summarized in this table below. These strategies range from encoding each digit of a number as separate tokens to encoding the entire number as a single token. 
