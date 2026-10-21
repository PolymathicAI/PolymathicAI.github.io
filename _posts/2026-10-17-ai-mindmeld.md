---
layout: post
title: "AI Mindmeld: A Latent Interconnect Protocol"
authors: Siavash Golkar, Jake Kovalic, Shirley Ho
shorttitle: "AI Mindmeld: A Latent Interconnect Protocol"
date: 2026-10-17 12:00
smallimage: ai-mindmeld/alina-grubnyak-unsplash.jpg
image: ai-mindmeld/alina-grubnyak-unsplash.jpg
blurb: "We introduce LIP, a protocol that lets LLMs draw on specialist models through direct exchange of high-dimensional representations."
shortblurb: "We introduce LIP, a protocol that lets LLMs draw on specialist models through direct exchange of high-dimensional representations."
splashimage: /images/blog/ai-mindmeld/alina-grubnyak-unsplash.jpg
splash_alt: "A glowing white visualization of a brain against a dark background, photographed by Alina Grubnyak."
splash_crop: "8 / 5"
splash_position: "center center"
link: https://polymathic-ai.org/papers/aimm.pdf
github_link: https://github.com/PolymathicAI/AI-Mindmeld
connectors_link: https://huggingface.co/sgolkar/ai-mindmeld-connectors
data_link: https://huggingface.co/datasets/sgolkar/ai-mindmeld-data
permalink: /blog/ai-mindmeld/
---

<style>
  .blog-single-page > .article-header .article-title > h3.title {
    word-spacing: 0.08em;
  }
  .blog-single-page hr {
    display: none;
  }
  .blog-single-page .article-content h2 {
    font-size: 24.5px;
    line-height: 1;
    margin: 32px 0 12px;
  }
  .blog-single-page .article-content ul {
    margin: 0 0 16px;
    padding: 0 0 0 20px;
  }
  .blog-single-page .article-content li {
    margin: 0 0 4px;
    padding: 0;
  }
  .blog-single-page .article-content li:last-child {
    margin-bottom: 0;
  }
  @media (max-width: 767px) {
    .blog-single-page > .article-header img,
    .blog-single-page .article-content img {
      width: 100% !important;
      max-width: 100% !important;
      height: auto;
    }
  }
</style>

An LLM's capabilities need not end with what it learned during training. By drawing on other models, it can gain access to knowledge learned from different data and specialized for different problems. Scientific foundation models offer a natural opportunity for this kind of collaboration: the patterns they learn from scientific data can complement an LLM's knowledge of language and literature, helping it tackle questions it could not answer as well on its own.

LLMs typically draw on these models through tool calling, requesting a prediction or calculation and bringing the result into their context. But while the outputs and internal representations of other models can be rich and varied, an LLM generally needs to receive their information as text, images, audio, or video—the forms through which humans communicate. Translating between the models this way creates a bottleneck. A specialist may encode much more than can be captured by the handful of properties an agent knows to ask for and express in words.

For example, suppose we ask an agent whether a compound can block a particular protein inside a human cell. To work toward an answer, it might query what the protein does, where it is found in the cell, and a chemical property of the compound such as logP. Each result gives the agent another clue, but the exchange is limited to the properties it has chosen to request. The specialist models may encode other relevant features and relationships that never enter the conversation because the agent does not know to ask for them.

<p align="center" style="margin: 1.5rem 0;">
  <img style="width: 66.5%; max-width: 630px;" src="/images/blog/ai-mindmeld/tool-calling-example.png" alt="Illustrative tool-calling workflow: an LLM asks whether a compound can block a protein inside a human cell, then queries protein function, protein location, and compound logP, receiving kinase, cytosol, and 2.4 before forming an answer.">
</p>

This bottleneck is striking because LLMs and specialist models already operate in high-dimensional spaces, where their internal representations encode many features and relationships together. We may struggle to visualize these embeddings or put their contents into words, but they are the native computational form of both LLMs and scientific foundation models. A direct connection between these spaces could give the LLM access to information it would not think to request explicitly. In the example above, [MIMIC](/blog/mimic/), a foundation model for biomolecules, could provide a rich representation of the protein, while [MolFormer](https://github.com/IBM/molformer), a foundation model for small molecules, could do the same for the compound. The LLM could then draw on the features and relationships captured by both models as it considers whether the compound could block the protein.

<p align="center" style="margin: 1.5rem 0;">
  <img style="width: 66.5%; max-width: 630px;" src="/images/blog/ai-mindmeld/lip-agent-example.png" alt="The same question about a compound blocking a protein, answered through the AI Mindmeld agent: MIMIC encodes the protein and MolFormer encodes the compound, and both representations enter the LLM directly.">
</p>

We envision a future in which this direct exchange becomes a routine part of how models work together: an AI mindmeld. An LLM could bring together representations from several specialists and draw on them as its questions evolve, alongside its existing knowledge and conventional tools.

## What a useful interface needs

Making this vision practical means confronting the cost of connecting models. Training a frontier LLM is an enormous investment, and even fine-tuning one can be expensive. Asking every specialist team to fine-tune and maintain its own version would make participation difficult for much of the community. And the target keeps moving: frontier LLMs continue to improve, so teams would face that expense again whenever they wanted to adopt a newer model.

For a community to build on this approach, researchers need to be able to contribute specialists independently and use them together as new questions arise. A shared interface should therefore have three properties:

- **Flexibility:** A specialist's representations can support different questions and tasks, allowing an agent to use the information as its needs change.
- **Extensibility:** New specialists can be connected without modifying the shared LLM or disrupting connections that others have already built.
- **Compositionality:** Independently connected specialists can contribute information together, without joint training for each new combination.

These requirements mean that the shared LLM must remain frozen while specialists are connected to it. The work of aligning their representations should instead sit in connectors: learned mappings that are relatively inexpensive to construct. Keeping that investment manageable would let teams add specialists to an existing LLM and retrain their connectors when a better one arrives, making it practical for the community to keep building as the models evolve.

## Latent Interconnect Protocol

We introduce the **Latent Interconnect Protocol (LIP)**, a framework for connecting specialist models to LLMs that is designed to be flexible, extensible, and compositional. Each specialist is linked to a shared LLM through a learned connector that translates between their internal representations. These connectors are trained independently, while the specialist models and the LLM remain frozen.

LIP works by combining ordinary text with specialist representations in the same prompt. Each representation is assigned a position, or *slot*, where its connector feeds information into selected internal layers of the LLM. In the figure below, the orange and green paths show two specialists supplying separate slots. The LLM can then attend to this information as it processes the surrounding text and generates its response. The text specifies the task, so the same representations and connectors can be reused with different questions.

<p align="center" style="margin: 1.5rem 0;">
  <img style="width: 49.7252%; max-width: 471.081px;" src="/images/blog/ai-mindmeld/lip-interface.png" alt="Figure 1 right panel: independently selected connectors from the LIP registry write specialist representations into separate prompt slots at selected internal layers of the shared LLM.">
</p>

Trained connectors can be shared in a registry for a given LLM, shown at the bottom of the LIP interface diagram above. Selecting several entries brings their representations together in one prompt, whether they describe different objects or offer different views of the same object. The connectors can be combined without having been trained together.

Training a connector means learning how to make the specialist's representations useful to the LLM. We start with an initial alignment between their internal states, using text about the same objects as a guide. We then select useful layers for the information to enter and refine the mappings using feedback from the LLM's answers to training questions. Only the connector is updated, so adding a specialist leaves the shared LLM and existing connections unchanged. Our experiments test how well the LLM can use these connections when the questions and combinations differ from those used to train the individual connectors.

<p align="center" style="margin: 1.5rem 0;">
  <img style="width: 95%; max-width: 900px;" src="/images/blog/ai-mindmeld/training.png" alt="Figure 2: independent connector training in three stages—align representations, select injection layers, and train the connector while keeping the specialist and LLM frozen.">
</p>

## Putting the interface to the test

To put LIP to the test, we turn to a setting where different kinds of specialist knowledge naturally meet: the interactions between proteins and small molecules. Proteins carry out much of a cell's work, and small molecules can interact with them and affect what they do. Models trained on each can therefore contribute different pieces of information to the same question. We connect three protein models and three small-molecule models to Kimi K2.6, a 1 trillion parameter mixture-of-experts (MoE) reasoning model with 32 billion active parameters, to explore how an LLM can use these sources separately and together.

To explore the flexibility, extensibility, and compositionality of LIP, we organize our evaluation around the progression shown below. We train each connector independently on a subset of objects and questions, then ask familiar questions about unseen proteins or molecules. Next come new question types about unseen objects. Finally, we ask about relationships between proteins and molecules, combining connectors that have never been trained together.

<p align="center" style="margin: 1.5rem 0;">
  <img style="width: 95%; max-width: 900px;" src="/images/blog/ai-mindmeld/evaluation-tasks.png" alt="Figure 4b: evaluation progresses from familiar questions about unseen proteins and molecules to new questions and joint use of independently trained connectors.">
</p>

We want the LLM to draw on the same injected embedding in a variety of contexts. To encourage this, we turn existing annotations from Swiss-Prot for proteins and ChEBI for molecules into several kinds of training question. As illustrated below, these range from asking for a description to checking an individual property with a Yes/No question or comparing two objects—for example, asking whether two proteins belong to the same family.

<p align="center" style="margin: 1.5rem 0;">
  <img style="width: 95%; max-width: 900px;" src="/images/blog/ai-mindmeld/training-examples.png" alt="Figure 3a: examples of text, Yes/No, and relational questions used to train a connector.">
</p>

## Results

**Extensibility.** Each of the six connectors is trained separately, yet the same frozen LLM can use any of them to answer questions in its domain. The plots below show a protein connector and a molecule connector answering familiar question types about unseen objects. Adding a molecule specialist does not require retraining the protein connectors, or vice versa, and neither requires updating the LLM. AUROC measures how well the model separates Yes and No cases: 0.5 is chance and 1.0 is perfect.

<p align="center" style="margin: 1.5rem 0;">
  <img style="width: 95%; max-width: 611px;" src="/images/blog/ai-mindmeld/unseen-objects.png" alt="Protein and molecule connector performance on familiar question types about unseen objects.">
</p>

**Flexibility.** A useful connection should also support questions beyond those used to train it. With the protein connectors, the LLM can answer new questions about properties such as whether a protein comes from an animal or exceeds a certain length. With molecule connectors, transfer is particularly strong for molecular mass, while questions about chemical roles are more variable and some remain near chance. These results show that the connectors make information available beyond their supervised tasks, although that access is not equally effective for every question.

<p align="center" style="margin: 1.5rem 0;">
  <img style="width: 95%; max-width: 611px;" src="/images/blog/ai-mindmeld/unseen-tasks.png" alt="Protein and molecule connector performance on unseen task types, including length and mass.">
</p>

**Compositionality.** The next test brings independently trained connections together. We first give the LLM three views of the same unseen protein, one each from MIMIC, ESM-C, and PGLM. Combining them improves mean AUROC over each individual connector on both trained and unseen tasks. The connectors have never been trained together, but the LLM can still benefit from the information they supply jointly.

We then combine a protein connector with a molecule connector and ask whether the molecule participates in a reaction carried out by the protein. This introduces both a new combination of specialists and a new kind of relationship question. The LLM ranks annotated protein–molecule pairs above mismatched pairs about 75% of the time when both objects are unseen, rising to 80% when the molecule is familiar. These separately trained connections let the LLM answer questions that require information from both domains, without training on their combination.

<p align="center" style="margin: 1.5rem 0;">
  <img style="width: 95%; max-width: 836px;" src="/images/blog/ai-mindmeld/composition-kimi.png" alt="Individual and composed protein connectors on trained and unseen tasks, shown on a shared AUROC axis, alongside cross-domain reaction-participation ordering for seen and unseen molecules.">
</p>

**Scaling with the LLM.** To test how transfer depends on the LLM interpreting the representations, we repeat the connector-training procedure with Gemma 3 4B and 12B. Across both domains, performance on new questions rises from the smaller Gemma model to the larger one, and then to Kimi K2.6. This suggests that a more capable LLM can make better use of the same specialists' information beyond the connector's training tasks.

<p align="center" style="margin: 1.5rem 0;">
  <img style="width: 95%; max-width: 465.5px;" src="/images/blog/ai-mindmeld/transfer-across-llms.png" alt="Figure 6c: mean protein and molecule transfer AUROC across Gemma 4B, Gemma 12B, and Kimi K2.6.">
</p>

**A limitation: reasoning over latent inputs.** Better access to information does not yet mean the LLM uses it well throughout its reasoning. In the examples below, the LLM treats an injected protein representation as though it had received a protein name. In our tests, asking for brief reasoning before an answer lowers protein-property performance for all three LLMs.

<p align="center" style="margin: 1.5rem 0;">
  <img style="width: 95%; max-width: 836px;" src="/images/blog/ai-mindmeld/latent-input-responses.png" alt="Figure 9: examples of an LLM interpreting latent inputs as names, and protein-property performance with direct answers versus answers after reasoning.">
</p>

One possibility is that the LLM turns the unfamiliar latent input into a familiar name and then reasons from that name, leaving other information in the representation behind.

## Conclusion

LIP demonstrates how a shared LLM can draw on independently connected specialists to answer new questions and combine information across domains. The broader vision is a growing collection of models whose knowledge can be brought together as our questions evolve. Teams could contribute expertise learned from different data, while others build on those contributions in combinations that no single team had planned. Direct representation exchange offers a way for that collaboration to draw on the richness of what each model has learned.

To realize this vision, the shared LLM should be prepared for these connections during its own training. We encourage LLM builders to provide supported latent input slots and train their models to use the information in those slots across questions, combinations of specialists, and extended reasoning. A documented interface would give independent teams a common place to connect their models, making it easier for the community to turn separately learned knowledge into shared capabilities.

## Build with LIP

Our [AI Mindmeld repository](https://github.com/PolymathicAI/AI-Mindmeld) provides the code and instructions for training and using connectors. The [LIP library](https://github.com/PolymathicAI/AI-Mindmeld/tree/main/library) brings together connector descriptions, supported LLMs, and links to code and weights, giving researchers a place to find connections they can build on.

Download the [connectors](https://huggingface.co/sgolkar/ai-mindmeld-connectors) and [data](https://huggingface.co/datasets/sgolkar/ai-mindmeld-data) from Hugging Face.

We invite teams to contribute connectors for their own specialists. Host the code and weights in your own repository or model hub, then [submit a listing](https://github.com/PolymathicAI/AI-Mindmeld/blob/main/CONTRIBUTING.md#list-your-connector) to the library with a short description, supported LLMs, and download links. You maintain your connector; we maintain the directory. This lets teams share their work independently while making it easier for others to discover and combine their contributions.

*– Siavash Golkar*

Image by [Alina Grubnyak](https://unsplash.com/photos/a-black-and-white-photo-of-a-brain-tEVGmMaPFXk) via Unsplash.
