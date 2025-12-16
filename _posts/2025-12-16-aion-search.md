---
layout: post
title: "AION-Search: Semantic search for 100M+ galaxy images using AI-generated captions"
authors: Nolan Koblischke, Liam Parker, Francois Lanusse, Irina Espejo Morales, Jo Bovy, Shirley Ho
shorttitle: "AION-Search: Semantic Search for Galaxy Images"
date: 2025-12-16 11:00
image: aion-search/aionsearchsplash.jpg
smallimage: aion-search/aionsearchsplash.jpg
blurb: The first system to enable meaning-based search across 140 million galaxy images with no human annotation required.
shortblurb: Semantic search across 140 million galaxy images using AI-generated captions.
splashimage: /images/blog/aion-search/aionsearchsplash.jpg
link: https://arxiv.org/abs/2512.11982
github_link: https://github.com/NolanKoblischke/AION-Search
permalink: /blog/aion-search/
---

How could we best leverage "a country of geniuses in a datacenter" ([1](#fn1)) to explore massive scientific datasets and unveil discoveries?

When it comes to astrophysics, we are producing imaging data at a scale that makes manual interpretation impossible. These datasets contain hundreds of millions of galaxy images, and upcoming telescopes will increase this to billions. Extracting scientific value from survey datasets has traditionally required human annotation, even in the age of machine learning. However, human labelling is often limited to predefined categories and requires substantial time and coordination. We need semantic search: the ability to search based on meaning.

AION-Search uses large language models (LLMs) that can process image data, such as GPT-4, to generate captions for unlabeled galaxy images and is the first system to enable meaning-based search across galaxy images with absolutely no human annotation required. It allows researchers to search by scientific intent rather than label availability, an essential tool for exploring massive datasets for rare phenomena in which the majority of observed objects may not be cataloged or classified at all.

---

Under the hood, AION-Search works in three steps:
#### 1. Caption generation

First, a galaxy image is shown to an image-capable language model (such as GPT-4.1-mini) and it is asked to describe the observable features in scientific terms. The model produces short descriptions (e.g., "face-on spiral with two arms and a central bar"), which are then converted into numerical representations that encode the meaning of the description. These captions serve as the semantic reference that later allows the system to search by concept rather than by visual similarity.

At this point, one might ask: if captions already provide a searchable semantic representation, why not simply generate captions for all galaxies?

The answer is cost.

Generating high-quality scientific descriptions for every image using vision-language models would be computationally and financially prohibitive. We need a way to obtain these semantic representations directly from images, without having to caption each one individually.

<p align="center">
<img src="/images/blog/aion-search/fig1.jpg" alt="Caption generation process" width="65%">
</p>

#### 2. Contrastive alignment

To address this, we train the model so that images and their corresponding descriptions end up close to each other in the same representation space. The image embedding from AION-1 and the meaning embedding from the caption are pulled together, while mismatched image-text pairs are pushed apart. This process is referred to as contrastive learning. After alignment, the model can predict the semantic embedding directly from an image, eliminating the need to generate captions for every sample. We use AION-1 here because its representations are already physically meaningful and well-suited for capturing galaxy morphology (learn more about AION-1 [here](/blog/aion-1/)).

This is where we get the ability to search massive datasets with language queries such as "visible spiral arms":

<p align="center">
<img src="/images/blog/aion-search/fig2.jpg" alt="Contrastive alignment" width="90%">
</p>

#### 3. Improving discovery with re-ranking

After a semantic query is made, the system retrieves images whose embeddings are closest to the query in semantic space. For rare or subtle phenomena, only a small fraction of these candidates may be true matches. In a traditional workflow, a human expert would now manually examine the top few hundred images to determine which ones actually contain the feature of interest.

Instead, AION-Search delegates this review step to a more capable model which evaluates each candidate and assigns a relevance score based on how well it matches the query. The results are then reordered according to these scores and targeted phenomena rise to the top of the list—useful especially when searching for rare phenomena such as strong gravitational lenses.

<p align="center">
<img src="/images/blog/aion-search/fig3.jpg" alt="Re-ranking process" width="60%">
</p>

---

#### Implications

For the first time, astronomers can free-form search datasets with millions of images just using the search engine. Through this, researchers will not only be able to find the objects they have in mind, but potentially land on new, serendipitous discoveries, or unknown unknowns! We believe AION-Search is a flexible way to explore these sorts of large, image-based datasets, and that similar technology applied to other domains of science could change how researchers interact with data.

---

#### Try out AION-Search!

We have a public app to enable search over a ~20 million galaxy subset of the full dataset.

<p align="left">
<a href="https://huggingface.co/spaces/astronolan/AION-Search" target="_blank" class="button-post">Try AION-Search</a>
</p>

<p align="center">
<img src="/images/blog/aion-search/fig4.jpg" alt="AION-Search demo" width="90%">
</p>

*-- Sophie Barstein, Nolan Koblischke*

References.

<p id="fn1">(1) Dario Amodei, <a href="https://darioamodei.com/machines-of-loving-grace">"Machines of Loving Grace"</a>, 2024.</p>
Cover image credit: DESI Legacy Imaging Surveys
