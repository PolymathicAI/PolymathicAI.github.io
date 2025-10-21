---
layout: post
title: "Universal Spectral Tokenization"
authors: Jeff Shen, Francois Lanusse, Liam Holden Parker, Ollie Liu, Tom Hehir, Leopoldo Sarra, Lucas Thibaut Meyer, Micah Bowles, Sebastian Wagner-Carena, Helen Qu, Siavash Golkar, Alberto Bietti, Hatim Bourfoune, Pierre Cornette, Keiya Hirashima, Geraud Krawezik, Ruben Ohana, Nicholas Lourie, Michael McCabe, Rudy Morel, Payel Mukhopadhyay, Mariel Pettee, Kyunghyun Cho, Miles Cranmer, Shirley Ho
shorttitle: "Universal Spectral Tokenization"
date: 2025-10-21 09:00
image: spectok/spectra.png
smallimage: spectok/spectra.png
blurb: "A universal tokenizer for spectra that directly ingests native wavelength grids without resampling, enabling seamless integration across astronomical surveys."
shortblurb: "A universal tokenizer for spectra that directly ingests native wavelength grids without resampling, enabling seamless integration across astronomical surveys."
link: # TODO: fill this out with arxiv link
splashimage: /images/blog/spectok/spectra.png
permalink: /blog/spectrum-tokenizer/
---

Every star and galaxy carries a hidden fingerprint: its light, spread out across different wavelengths, encodes clues about what it's made of and how it evolves. Scientists capture this information as spectral data, a type of sequential data that records how light intensity changes step by step with wavelength. But here's the catch: different telescopes and instruments record spectra in different ways—at varying resolutions, sampling patterns, and wavelength ranges. This patchwork makes it difficult to compare and combine data across experiments; combining such diverse data is important because together, they can give us a more complete view of the objects we study. How can we build a model that unifies such diverse spectra into a common representation, paving the way for large-scale, foundation models in science?

## The Fragmented Spectroscopic Landscape

Spectra encode fundamental astrophysical information, from stellar chemical abundances to galaxy dynamics and the state of the intergalactic medium. Large-scale surveys such as SDSS, DESI, GALAH, and APOGEE have collected millions of spectra across a wide range of wavelengths, resolutions, and science targets.

However, analysis pipelines remain fragmented: each survey typically requires bespoke preprocessing and task-specific machine learning models. This siloed approach limits flexibility, prevents the reuse of knowledge across datasets, and makes it difficult to combine heterogeneous information into a shared representation. Training a new model for every instrument, object class, or task is inefficient and hinders generalization.

### Limitations of Previous Approaches

<details>
<summary><b>Redshift Dependencies:</b></summary>
Many previous methods require a good estimate of the redshift—the stretching of light to longer wavelengths as the universe expands—before processing, since they operate in rest-frame wavelengths. This creates a chicken-and-egg problem: you need to know the redshift to analyze the spectrum, but spectroscopic analysis is often used to determine redshift in the first place.
</details>

<details>
<summary><b>Preprocessing Requirements:</b></summary>
Traditional approaches require extensive preprocessing—steps like amplitude normalization, continuum fitting, or other survey-specific transformations (adjustments tailored to the quirks of each telescope or survey). It's a bit like each camera applying its own filter to the same scene: the result looks different depending on the instrument, and important details can be lost along the way. Physically motivated spectral analysis methods also rely on strong assumptions about the underlying physics, leading to possible problems caused by model misspecification.
</details>

<details>
<summary><b>Fixed Grid Models:</b></summary>
Previous self-supervised spectral models work on a fixed latent grid, meaning they force every spectrum onto the same wavelength points. This is like resizing every photo to the same pixel grid—you can make them line up, but fine details get blurred and artifacts appear. To combine data from multiple surveys, they would need to interpolate all spectra onto a single, massive grid—computationally prohibitive and scientifically problematic.
</details>

<details>
<summary><b>Survey-Specific Models:</b></summary>
Supervised approaches can achieve high accuracy where labels exist, but are tied to particular surveys. Even contrastive methods that learn spectral representations often rely on separate encoders/decoders for each survey, like needing a different translator for every dialect instead of one system that understands them all.
</details>

## Our Solution: A Universal Spectrum Tokenizer

<p align="center">
  <img src="/images/blog/spectok/spectra.png" alt="Universal Spectrum Tokenizer Diagram" width="100%" style="max-width:100%">
</p>

We propose a universal tokenizer for spectra that directly ingests native wavelength grids without resampling, enabling seamless integration across surveys. Our approach requires nothing but the spectrum itself—no redshift estimates, no continuum normalization, no survey-specific preprocessing. Unlike fixed grid models that require expensive interpolation, our model uses continuous wavelength-based positional encoding, allowing it to represent spectra with arbitrary coverage and resolution. In contrast to survey-specific approaches, our single encoder scales to arbitrary datasets. Trained in a self-supervised manner with a reconstruction objective that incorporates mask- and noise-aware weighting, it produces robust and physically meaningful representations.

### Why Our Approach Works

Our approach is the first to demonstrate a single model that can pretrain jointly across heterogeneous spectroscopic surveys on their native wavelength grids without homogenization, redshift estimates, or preprocessing—making it truly data-driven and universally applicable.

### Key Contributions

- **Novel Architecture:** Operates directly on irregular wavelength grids using continuous sinusoidal embeddings and patch-level validity masks.
- **Truly Data-Driven:** Requires only the spectrum itself—no redshift estimates, no continuum normalization, no survey-specific preprocessing. This eliminates circular dependencies and preserves all scientific information.
- **Panchromatic Training:** Multi-resolution, self-supervised pretraining strategy applied to SDSS, DESI, GALAH, and APOGEE, yielding cross-domain, homogeneous, physically meaningful representations with a single backbone.
- **Lightweight Adaptation:** Demonstrates that these embeddings achieve competitive performance on downstream tasks such as object classification and stellar parameter regression relative to task-specific baselines.
- **Universal Design:** Architecture naturally extends to other forms of irregular, multiresolution sequential data such as time series.

<p align="center">
  <img src="/images/blog/spectok/recon.png" alt="Examples of Reconstructed Spectra" width="100%" style="max-width:100%">
</p>

## Results: Broad Applicability with Competitive Performance

Our goal is not to achieve state-of-the-art performance or exhaustively benchmark capabilities, but to illustrate broad applicability. Unlike traditional pipelines built from scratch and optimized per task or dataset, our universal tokenizer enables reuse across many settings.

### Object Classification

We evaluate our model on the task of object classification, where the goal is to classify spectra into different object types (e.g., galaxies, stars, quasars). We train a lightweight adaptation module on top of the embeddings from our frozen pretrained universal spectrum tokenizer. When adapted to classify celestial objects using DESI data, our model achieved 96% average accuracy, matching specialized, survey-specific models built from scratch for this single task.

### Stellar Parameter Estimation

For measuring stellar properties like effective temperature (T<sub>eff</sub>), surface gravity (log g), and metallicity ([Fe/H]) from APOGEE spectra, our adaptation module achieved performance that is competitive with or better than specialized models designed specifically for APOGEE data, demonstrating that general-purpose representations can match task-specific approaches:

**Performance metrics (median absolute deviation, lower is better):**
- **Temperature (Teff):** σ=23 K
- **Surface Gravity (log g):** σ=0.07 dex
- **Metallicity ([Fe/H]):** σ=0.02 dex

<details style="display: inline;">
<summary><h2>How It Works (Technical)</h2></summary>

The model is based on the Vision Transformer architecture, adapted for one-dimensional spectral data. Here's the process:

**Technical Deep-Dive:** Our model is based on a Vision Transformer (ViT) architecture, adapted for one-dimensional spectral data. The fluxes of each spectrum are normalized by their median, combined with the corresponding flux measurement errors, and then split into patches. The wavelength information is sinusoidally encoded and then patched and added to the normalized flux patches. Bad patches are marked and ignored in later computation. The patches are then processed by a series of transformer blocks. The output is a sequence of homogeneous tokens representing spectral features.

Our innovative encoder creates homogeneous, wavelength-aware embeddings from heterogeneous input spectra, allowing these embeddings to be used for a variety of downstream tasks. What makes this powerful is that spectra of varying wavelength coverage, resolution, and object type are processed simultaneously in their native formats, producing intrinsically aligned representations that are physically meaningful.

### Panchromatic, Multi-Resolution Training

We train our model using spectroscopic data from four major surveys: SDSS DR17, GALAH DR3, DESI DR1, and APOGEE. These surveys span vastly different wavelength ranges and resolutions, from optical (3600–10400 Å) to near-infrared (1.51–1.7 μm), and from low resolution (R~2,000) to high resolution (R~28,000).

Crucially, our model is trained across all of these datasets without homogenization, efficiently leveraging the native wavelength grids and resolutions of each survey. To put this in perspective: a traditional fixed grid model attempting to cover the same wavelength range and resolution would require a grid size of 300K pixels—a computational impossibility that would also introduce significant interpolation errors.

**Survey Specifications:**

| Survey | Wavelength Range | Resolution |
|--------|-----------------|------------|
| SDSS DR17 | 3600-10400 Å | R~2,000 |
| DESI DR1 | 3600-9800 Å | R~5,000 |
| GALAH DR3 | 4700-7900 Å | R~28,000 |
| APOGEE | 1.51-1.7 μm | R~22,500 |

The spectra span multiple orders of magnitude in flux, as well as great diversity in underlying physical phenomena (and thus spectral features); a single model with our design is able to handle all these differences. Critically, while many traditional pipelines perform analysis on normalized spectra (divided by a continuum) or require other preprocessing steps that vary between surveys, our model natively handles absolute flux values without any preprocessing. This eliminates survey-specific biases and preserves valuable scientific information that normalization procedures often discard.

</details>

## Why This Matters

This work represents a fundamental shift toward foundation models in astronomy. Instead of building bespoke models for each survey and task, we can now create a single, unified representation of spectral data. This enables:

- **Cross-Survey Analysis:** Combine data from different telescopes seamlessly
- **Rapid Task Adaptation:** Quickly adapt to new scientific questions with minimal training
- **Knowledge Transfer:** Leverage insights learned from one survey to understand another
- **Unified Infrastructure:** Build once, use everywhere

Beyond astronomy, this approach has potential applications in any field dealing with irregular, multi-resolution sequential data—from climate science to healthcare, where sensors and instruments produce data in different formats and resolutions.

## Looking to the Future

Our universal spectral tokenizer is just the beginning. We envision it serving as a foundational layer for more powerful multi-modal models that can fuse spectroscopic data with images, time series, and other astronomical observations into a single, comprehensive representation of the universe.

### The Bigger Picture

We're moving toward a future where astronomical AI can understand the universe holistically, not just through the narrow lens of individual instruments. This approach will accelerate discoveries and reveal connections that fragmented methods would miss entirely.

